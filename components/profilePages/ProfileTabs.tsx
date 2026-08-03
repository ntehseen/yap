import React from 'react';
import { LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProfileTab = 'posts' | 'media';

interface Props {
  tab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  postsCount: number;
  mediaCount: number;
}

export default function ProfileTabs({
  tab,
  onChange,
  postsCount,
  mediaCount,
}: Props) {
  return (
    <div className="flex border-b border-border">
      <button
        type="button"
        className={cn(
          'relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/40',
          tab === 'posts' && 'text-foreground'
        )}
        onClick={() => onChange('posts')}
      >
        <LayoutGrid className="h-4 w-4" />
        Posts
        <span className="text-xs text-muted-foreground">{postsCount}</span>
        {tab === 'posts' ? (
          <span className="absolute bottom-0 left-1/2 h-[1.5px] w-12 -translate-x-1/2 bg-foreground" />
        ) : null}
      </button>
      <button
        type="button"
        className={cn(
          'relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/40',
          tab === 'media' && 'text-foreground'
        )}
        onClick={() => onChange('media')}
      >
        <ImageIcon className="h-4 w-4" />
        Media
        <span className="text-xs text-muted-foreground">{mediaCount}</span>
        {tab === 'media' ? (
          <span className="absolute bottom-0 left-1/2 h-[1.5px] w-12 -translate-x-1/2 bg-foreground" />
        ) : null}
      </button>
    </div>
  );
}
