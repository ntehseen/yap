import React from 'react';
import { MessageCircle } from 'lucide-react';

function SendMessage({
  setCreateChatRoom,
}: {
  setCreateChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex h-full min-h-[320px] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12]">
        <MessageCircle className="h-8 w-8 text-foreground" strokeWidth={1.5} />
      </div>
      <h2 className="mt-4 text-[20px] font-semibold text-foreground">
        Your messages
      </h2>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
        Send a private message to another Yap player.
      </p>
      <button
        type="button"
        className="mt-5 h-[34px] rounded-[10px] bg-primary px-4 text-[15px] font-semibold text-primary-foreground"
        onClick={() => setCreateChatRoom(true)}
      >
        Send message
      </button>
    </div>
  );
}

export default SendMessage;
