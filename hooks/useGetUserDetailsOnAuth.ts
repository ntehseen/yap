/* eslint-disable react-hooks/exhaustive-deps */
import Router from 'next/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  onSnapshot,
  query,
  orderBy,
  collection,
  limit,
  Unsubscribe,
} from 'firebase/firestore';
import { useAtom } from 'jotai';
import React from 'react';
import app from '../util/firbaseConfig';
import atoms, {
  notificationTypes,
  chatRoomMessagesTypes,
  postType,
} from '../util/atoms';

function useGetUserDetailsOnAuth() {
  const db = getFirestore(app);
  const auth = getAuth();

  const [loggingIn] = useAtom(atoms.loggingIn);
  const [, setListeners] = useAtom(atoms.listeners);
  const [, setUserStatus] = useAtom(atoms.userStatus);
  const [, setUserDetails] = useAtom(atoms.userDetails);
  const [, setAllChatRoomMessages] = useAtom(atoms.allChatRoomMessages);
  const [, setUserNotifications] = useAtom(atoms.userNotifications);
  const [, setUserPosts] = useAtom(atoms.userPosts);
  const [, setHomePagePosts] = useAtom(atoms.homePagePosts);
  const [, setStories] = useAtom(atoms.stories);
  const [, setUsersListArray] = useAtom(atoms.usersListArray);

  /** Per-id unsubs so user-doc updates don't stack duplicate listeners. */
  const chatUnsubs = React.useRef<Map<string, Unsubscribe>>(new Map());
  const postUnsubs = React.useRef<Map<string, Unsubscribe>>(new Map());
  const storyUnsubs = React.useRef<Map<string, Unsubscribe>>(new Map());
  const coreUnsubs = React.useRef<Unsubscribe[]>([]);

  function clearMap(map: React.MutableRefObject<Map<string, Unsubscribe>>) {
    map.current.forEach((unsub) => unsub());
    map.current.clear();
  }

  function clearAllDynamicListeners() {
    clearMap(chatUnsubs);
    clearMap(postUnsubs);
    clearMap(storyUnsubs);
  }

  function syncKeyedListeners(
    map: React.MutableRefObject<Map<string, Unsubscribe>>,
    ids: string[],
    subscribe: (id: string) => Unsubscribe
  ) {
    const next = new Set(ids.filter(Boolean));
    map.current.forEach((unsub, id) => {
      if (!next.has(id)) {
        unsub();
        map.current.delete(id);
      }
    });
    next.forEach((id) => {
      if (map.current.has(id)) return;
      map.current.set(id, subscribe(id));
    });
  }

  function getChatRoomMessages(notifications: notificationTypes) {
    syncKeyedListeners(chatUnsubs, notifications.chatRoomIds || [], (chatRoomID) => {
      const q = query(
        collection(db, chatRoomID),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      return onSnapshot(q, (querySnapshot: any) => {
        const messages: chatRoomMessagesTypes[] = [];
        querySnapshot.forEach((document: any) => {
          messages.push(document.data());
        });
        setAllChatRoomMessages((prevState) => ({
          ...prevState,
          [chatRoomID]: messages,
        }));
      });
    });
    publishListenerBundle();
  }

  function getHomePagePosts(notifications: notificationTypes) {
    syncKeyedListeners(postUnsubs, notifications.following || [], (username) => {
      const q = query(
        collection(db, `${username}Posts`),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      return onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((document: any) => {
          setHomePagePosts((prevState) => ({
            ...prevState,
            [username]: document.data(),
          }));
        });
      });
    });
    publishListenerBundle();
  }

  function getFollowingStories(notifications: notificationTypes) {
    syncKeyedListeners(storyUnsubs, notifications.following || [], (username) =>
      onSnapshot(doc(db, 'users', username), (docs) => {
        if (docs.data() && docs.data()!.story !== '') {
          setStories((prevState) => ({
            ...prevState,
            [username]: docs.data()!.story,
            [`${username}Views`]: docs.data()!.storyViews,
            [`${username}Photo`]: docs.data()!.avatarURL,
          }));
        }
      })
    );
    publishListenerBundle();
  }

  function userLiveUpdates(user: User) {
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.displayName!),
      (document: any) => {
        const data = document.data() || {};
        setUserNotifications(data);
        getChatRoomMessages(data);
        getHomePagePosts(data);
        getFollowingStories(data);
      }
    );
    coreUnsubs.current.push(unsubscribe);
  }

  function getUserPosts(user: User) {
    const q = query(
      collection(db, `${user.displayName}Posts`),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      const postsArray: postType[] = [];
      querySnapshot.forEach((document: any) => {
        postsArray.push(document.data());
      });
      setUserPosts(postsArray);
    });
    coreUnsubs.current.push(unsubscribe);
  }

  function getAllUsersList() {
    const q = query(collection(db, 'userList'), limit(1000));
    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      const usersArray: string[] = [];
      querySnapshot.forEach((document: any) => {
        usersArray.push(document.id);
      });
      setUsersListArray(usersArray);
    });
    coreUnsubs.current.push(unsubscribe);
  }

  function publishListenerBundle() {
    const all = [
      ...coreUnsubs.current,
      ...Array.from(chatUnsubs.current.values()),
      ...Array.from(postUnsubs.current.values()),
      ...Array.from(storyUnsubs.current.values()),
    ];
    setListeners(all);
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Drop previous session listeners before attaching new ones
      coreUnsubs.current.forEach((u) => u());
      coreUnsubs.current = [];
      clearAllDynamicListeners();

      if (user) {
        setUserStatus(true);
        setUserDetails(user);
        userLiveUpdates(user);
        getUserPosts(user);
        getAllUsersList();
        publishListenerBundle();
      } else {
        setListeners([]);
        Router.push('/Login');
      }
    });

    return () => {
      unsubscribe();
      coreUnsubs.current.forEach((u) => u());
      coreUnsubs.current = [];
      clearAllDynamicListeners();
      setListeners([]);
    };
  }, [loggingIn]);
}

export default useGetUserDetailsOnAuth;
