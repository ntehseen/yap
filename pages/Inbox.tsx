 
 
import Head from 'next/head';
import React from 'react';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import ChatRoom from '../components/InboxPage/ChatRoom';
import CreateChatRoom from '../components/InboxPage/CreateChatRoom';
import SendMessage from '../components/InboxPage/SendMessage';
import LoadingPage from '../components/loadingComps/LoadingPage';
import NewMessageSVG from '../components/svgComps/NewMessageSVG';
import atoms from '../util/atoms';
import LoadingChatRooms from '../components/loadingComps/LoadingChatRooms';
import handleResetNewMessage from '../util/handleResetNewMessage';
import AppShell from '../components/layout/AppShell';

const Inbox: NextPage = () => {
  const [userStatus] = useAtom(atoms.userStatus);
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [chatRoomLoading, setChatRoomLoading] = useAtom(atoms.chatRoomLoading);

  const [activeChat, setActiveChat] = React.useState('');
  const [createChatRoom, setCreateChatRoom] = React.useState(false);

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Inbox" title="Messages">
      <Head>
        <title>Messages • Yap</title>
        <meta name="description" content="Chat with Yappers on Yap." />
        <link rel="icon" href="/instagram.png" />
      </Head>
      {createChatRoom ? (
        <CreateChatRoom setCreateChatRoom={setCreateChatRoom} />
      ) : (
        <div />
      )}
      <div className="relative mx-auto mt-2 h-[calc(100vh-8rem)] w-full max-w-[935px] border border-border bg-card sm:mt-4 xl:h-[calc(100vh-2rem)]">
        <div className="flex h-[60px] w-[130px] items-center border-b border-border md:w-[350px] md:px-5">
          <h1 className="mx-auto">{userDetails.displayName}</h1>
          <button
            onClick={() => setCreateChatRoom(!createChatRoom)}
            type="button"
            aria-label="New message"
          >
            <NewMessageSVG />
          </button>
        </div>
        {activeChat === '' ? (
          <SendMessage setCreateChatRoom={setCreateChatRoom} />
        ) : (
          <div />
        )}
        <div className="h-[calc(100%-60px)] w-[130px] overflow-y-auto overflow-x-hidden dark:[color-scheme:dark] md:w-[350px]">
          <div
            className={chatRoomLoading ? 'fixed opacity-0' : ''}
            onLoad={() => setChatRoomLoading(false)}
          >
            {userNotifications.chatRoomIds?.map((chatRoomId, index) => (
              <div
                key={`chatRoomKey${index}`}
                onClick={() => {
                  setActiveChat(`chatRoom${index}`);
                  handleResetNewMessage({
                    username: userDetails.displayName!,
                    chatRoomId,
                  });
                }}
                role="button"
                tabIndex={0}
              >
                <ChatRoom
                  chatRoomID={chatRoomId}
                  userID={userDetails.displayName!}
                  activeChat={activeChat}
                  activeChatId={`chatRoom${index}`}
                />
              </div>
            ))}
          </div>
          {chatRoomLoading && !userNotifications.chatRoomIds ? (
            <LoadingChatRooms />
          ) : (
            ''
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Inbox;
