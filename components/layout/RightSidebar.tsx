import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import atoms from '@/util/atoms';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function RightSidebar() {
  const [spotlightUsers] = useAtom(atoms.spotlightUsers);
  const suggestions = spotlightUsers.slice(0, 5);

  return (
    <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 py-6 pl-8 pr-4 lg:block">
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search Yappers"
          className="bg-muted"
          readOnly
          aria-label="Search (use sidebar Search on desktop)"
        />
      </div>
      <div className="rounded-lg border border-border bg-shell-elevated p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Suggested players
        </h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Follow people to fill this space.
          </p>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((user) => (
              <li key={user.userId || user.username}>
                <Link href={`/${user.username}`} className="flex items-center gap-3 text-sm hover:opacity-80">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase text-muted-foreground">
                      {(user.username || '?').slice(0, 1)}
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {user.username}
                    </span>
                  </Link>
              </li>
            ))}
          </ul>
        )}
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">
          Trending discussions and alliance tips land here next.
        </p>
      </div>
    </aside>
  );
}

export default RightSidebar;
