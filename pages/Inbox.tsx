import Head from 'next/head';
import React from 'react';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import { PenSquare } from 'lucide-react';
import ChatRoom from '../components/InboxPage/ChatRoom';
import CreateChatRoom from '../components/InboxPage/CreateChatRoom';
import SendMessage from '../components/InboxPage/SendMessage';
import LoadingPage from '../components/loadingComps/LoadingPage';
import atoms from '../util/atoms';
import LoadingChatRooms from '../components/loadingComps/LoadingChatRooms';
import handleResetNewMessage from '../util/handleResetNewMessage';
import AppShell from '../components/layout/AppShell';
import { cn } from '@/lib/utils';

const Inbox: NextPage = () => {
  const [userStatus] = useAtom(atoms.userStatus);
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [chatRoomLoading, setChatRoomLoading] = useAtom(atoms.chatRoomLoading);

  const [activeChat, setActiveChat] = React.useState('');
  const [createChatRoom, setCreateChatRoom] = React.useState(false);

  const roomIds = userNotifications.chatRoomIds || [];
  const hasRooms = roomIds.length > 0;
  const showThread = Boolean(activeChat);

  React.useEffect(() => {
    if (hasRooms || userNotifications.username) {
      setChatRoomLoading(false);
    }
  }, [hasRooms, userNotifications.username, setChatRoomLoading]);

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Inbox">
      <Head>
        <title>Messages • Yap</title>
        <meta name="description" content="Chat with Yappers on Yap." />
        <link rel="icon" href="/instagram.png" />
      </Head>

      {createChatRoom ? (
        <CreateChatRoom setCreateChatRoom={setCreateChatRoom} />
      ) : null}

      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-dvh">
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-white/[0.08] bg-[hsl(var(--feed))] px-[25px] max-md:top-14 max-md:bg-background">
          <h1 className="text-[15px] font-semibold text-foreground">
            Messages
          </h1>
          <button
            type="button"
            className="rounded-full p-2 text-foreground hover:bg-muted"
            onClick={() => setCreateChatRoom(true)}
            aria-label="New message"
          >
            <PenSquare className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>

        <div className="relative flex min-h-0 flex-1">
          {/* Conversation list */}
          <aside
            className={cn(
              'flex w-full flex-col border-white/[0.08]',
              showThread
                ? 'hidden w-[240px] border-r md:flex'
                : 'flex'
            )}
          >
            {chatRoomLoading && !hasRooms ? <LoadingChatRooms /> : null}

            {!chatRoomLoading && !hasRooms ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-[15px] font-semibold text-foreground">
                  No messages yet
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Start a yap with another player.
                </p>
                <button
                  type="button"
                  className="mt-5 h-[34px] rounded-[10px] bg-primary px-4 text-[15px] font-semibold text-primary-foreground"
                  onClick={() => setCreateChatRoom(true)}
                >
                  New message
                </button>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto">
              {roomIds.map((chatRoomId, index) => {
                const activeChatId = `chatRoom${index}`;
                return (
                  <button
                    key={chatRoomId}
                    type="button"
                    className="block w-full text-left"
                    onClick={() => {
                      setActiveChat(activeChatId);
                      if (userDetails.displayName) {
                        handleResetNewMessage({
                          username: userDetails.displayName,
                          chatRoomId,
                        });
                      }
                    }}
                  >
                    <ChatRoom
                      chatRoomID={chatRoomId}
                      userID={userDetails.displayName!}
                      activeChat={activeChat}
                      activeChatId={activeChatId}
                      mode="list"
                      onBack={() => setActiveChat('')}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active thread / empty state */}
          <section
            className={cn(
              'min-w-0 flex-1 flex-col',
              showThread ? 'flex' : 'hidden md:flex'
            )}
          >
            {!showThread ? (
              <SendMessage setCreateChatRoom={setCreateChatRoom} />
            ) : (
              roomIds.map((chatRoomId, index) => {
                const activeChatId = `chatRoom${index}`;
                if (activeChat !== activeChatId) return null;
                return (
                  <ChatRoom
                    key={`thread-${chatRoomId}`}
                    chatRoomID={chatRoomId}
                    userID={userDetails.displayName!}
                    activeChat={activeChat}
                    activeChatId={activeChatId}
                    mode="thread"
                    onBack={() => setActiveChat('')}
                  />
                );
              })
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default Inbox;
