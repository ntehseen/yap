interface ShareArgs {
  username: string;
  postId: string;
  text?: string;
}

export default async function handleSharePost({
  username,
  postId,
  text,
}: ShareArgs) {
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/post/${username}/${postId}`
      : `/post/${username}/${postId}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Yap',
        text: text?.slice(0, 120) || 'Check out this yap',
        url,
      });
      return;
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
  }
}
