import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { MoreHorizontal } from 'lucide-react';
import atoms from '../../util/atoms';
import formatRelativeTime from '../../util/formatRelativeTime';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import PostActions from '../post/PostActions';
import YapTypeBadge from '../post/YapTypeBadge';
import NoPostsFiller from './NoPostsFiller';

interface Props {
  username: string;
  index: number;
}

/** Threads post: 25px pad, 36px avatar, 12px gap, 15/21 type. */
const HomePagePost = ({ username, index }: Props) => {
  const router = useRouter();
  const [userDetails] = useAtom(atoms.userDetails);
  const [homePagePosts] = useAtom(atoms.homePagePosts);
  const [userPosts] = useAtom(atoms.userPosts);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isSelf = username === userDetails.displayName;
  const postDetails =
    homePagePosts[username] || (isSelf ? userPosts[0] : undefined);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  if (username === 'null') {
    return <NoPostsFiller />;
  }

  if (!postDetails?.comments) {
    if (isSelf) return null;
    return (
      <div className="border-b border-white/[0.08] px-[25px] py-3">
        <div className="flex gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const author = postDetails.comments[0];
  const body = author?.text || '';
  const replyCount = Math.max(postDetails.comments.length - 1, 0);
  const hasImage = Boolean(postDetails.imgURL);
  const threadHref = `/post/${username}/${postDetails.postID}`;
  const relative = formatRelativeTime(postDetails.createdAt);

  function openThread() {
    router.push(threadHref);
  }

  async function copyLink() {
    const url = `${window.location.origin}${threadHref}`;
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 900);
  }

  return (
    <article className="border-b border-white/[0.08] px-[25px] py-3">
      <div className="flex gap-3">
        <Link href={`/${username}`} className="shrink-0 self-start">
          {author.avatarURL ? (
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={author.avatarURL}
              alt=""
              width={36}
              height={36}
              priority={index === 0}
            />
          ) : (
            <div className="h-9 w-9">
              <ProfilePicSVG strokeWidth="1" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-baseline gap-1.5 leading-[21px]">
              <Link
                href={`/${username}`}
                className="truncate text-[15px] font-semibold text-foreground hover:underline"
              >
                {author.username}
              </Link>
              {relative ? (
                <>
                  <span className="text-[15px] text-muted-foreground">·</span>
                  <Link
                    href={threadHref}
                    className="shrink-0 text-[15px] text-muted-foreground hover:underline"
                  >
                    <time>{relative}</time>
                  </Link>
                </>
              ) : null}
            </div>

            <div className="relative -mr-2 shrink-0" ref={menuRef}>
              <button
                type="button"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="More"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 z-30 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg">
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-[15px] text-foreground hover:bg-muted"
                    onClick={copyLink}
                  >
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <YapTypeBadge post={postDetails} />

          {body ? (
            <button
              type="button"
              className="mt-0.5 w-full whitespace-pre-wrap text-left text-[15px] leading-[21px] text-foreground"
              onClick={openThread}
            >
              {body}
            </button>
          ) : null}

          {hasImage ? (
            <button
              type="button"
              className="mt-2 block w-full overflow-hidden rounded-[12px]"
              onClick={openThread}
            >
              <Image
                className="h-auto max-h-[520px] w-full object-cover"
                src={postDetails.imgURL}
                alt=""
                width={0}
                height={0}
                sizes="542px"
                priority={index === 0}
              />
            </button>
          ) : null}

          <PostActions
            post={postDetails}
            author={author}
            replyCount={replyCount}
            onReply={openThread}
          />
        </div>
      </div>
    </article>
  );
};

export default HomePagePost;
