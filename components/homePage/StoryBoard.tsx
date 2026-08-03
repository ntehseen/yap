import React from 'react';
import { useAtom } from 'jotai';
import AddStory from './AddStory';
import StoryBoardTag from './StoryBoardTag';
import atoms from '../../util/atoms';

function StoryBoard() {
  const [storiesArray] = useAtom(atoms.storiesArray);
  const [storiesLoading, setStoriesLoading] = useAtom(atoms.storiesLoading);

  const circles = [1, 2, 3, 4, 5];

  React.useEffect(() => {
    // Stories are optional chrome; don't leave the rail in a loading trap.
    const timer = window.setTimeout(() => setStoriesLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, [setStoriesLoading, storiesArray]);

  return (
    <div className="scrollbar flex gap-3 overflow-x-auto py-1">
      <AddStory />
      {storiesLoading ? (
        <div className="flex gap-3">
          {circles.map((index) => (
            <div
              key={index}
              className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      ) : (
        storiesArray.map((username, index) => (
          <StoryBoardTag username={username} key={username + index} />
        ))
      )}
    </div>
  );
}

export default StoryBoard;
