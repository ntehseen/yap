import React from 'react';
import Image from 'next/image';
import TextareaAutosize from 'react-textarea-autosize';
import { useAtom } from 'jotai';
import { ImagePlus, X } from 'lucide-react';
import atoms from '@/util/atoms';
import { publishYap } from '@/util/handleAddNewPost';
import { Button } from '@/components/ui/button';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';

function FeedComposer() {
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [caption, setCaption] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canPost = Boolean(caption.trim() || selectedImage) && !loading;
  const showActions =
    focused || Boolean(caption.trim()) || Boolean(selectedImage);

  React.useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  function clearImage() {
    setSelectedImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function onPublish() {
    if (!canPost) return;
    await publishYap({
      userNotifications,
      userDetails,
      caption,
      selectedImage,
      setLoading,
      onDone: () => {
        setCaption('');
        clearImage();
        setFocused(false);
      },
    });
  }

  return (
    <div className="border-b border-white/[0.08] px-[25px] py-3">
      <div className="flex gap-3">
        <div className="shrink-0 self-start pt-0.5">
          {userDetails.photoURL ? (
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={userDetails.photoURL}
              alt=""
              width={36}
              height={36}
              priority
            />
          ) : (
            <div className="h-9 w-9">
              <ProfilePicSVG strokeWidth="1.5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <TextareaAutosize
            className="w-full resize-none bg-transparent py-1.5 text-[15px] leading-[21px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="What's new?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onFocus={() => setFocused(true)}
            minRows={1}
            maxRows={8}
            disabled={loading}
          />
          {previewUrl ? (
            <div className="relative mt-2 overflow-hidden rounded-[12px]">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-80 w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                onClick={clearImage}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          {showActions ? (
            <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (
                      file.type === 'image/png' ||
                      file.type === 'image/jpeg' ||
                      file.type === 'image/jpg'
                    ) {
                      setSelectedImage(file);
                    }
                  }}
                />
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
                  aria-label="Add image"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <ImagePlus className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
              <Button
                type="button"
                size="sm"
                className="min-w-[64px]"
                disabled={!canPost}
                onClick={onPublish}
              >
                {loading ? 'Posting…' : 'Post'}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FeedComposer;
