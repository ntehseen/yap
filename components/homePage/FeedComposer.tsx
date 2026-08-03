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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canPost = Boolean(caption.trim() || selectedImage) && !loading;

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
      },
    });
  }

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex gap-3">
        <div className="shrink-0">
          {userDetails.photoURL ? (
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={userDetails.photoURL}
              alt=""
              width={40}
              height={40}
            />
          ) : (
            <div className="h-10 w-10">
              <ProfilePicSVG strokeWidth="1.5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <TextareaAutosize
            className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Start yapping..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            minRows={2}
            maxRows={8}
            disabled={loading}
          />
          {previewUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-border">
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
          <div className="mt-3 flex items-center justify-between">
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-accent"
                aria-label="Add image"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              disabled={!canPost}
              onClick={onPublish}
            >
              {loading ? 'Posting…' : 'Yap'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedComposer;
