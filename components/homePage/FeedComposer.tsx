import React from 'react';
import Image from 'next/image';
import TextareaAutosize from 'react-textarea-autosize';
import { useAtom } from 'jotai';
import { ImagePlus, X } from 'lucide-react';
import atoms, { YapPostKind } from '@/util/atoms';
import { publishYap } from '@/util/handleAddNewPost';
import { YAP_TYPE_OPTIONS, yapTypePlaceholder } from '@/util/yapTypes';
import { Button } from '@/components/ui/button';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import { cn } from '@/lib/utils';

function FeedComposer() {
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [caption, setCaption] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [yapType, setYapType] = React.useState<YapPostKind>('yap');
  const [server, setServer] = React.useState('');
  const [alliance, setAlliance] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const prefillsApplied = React.useRef(false);

  const canPost = Boolean(caption.trim() || selectedImage) && !loading;
  const showActions =
    focused || Boolean(caption.trim()) || Boolean(selectedImage);

  React.useEffect(() => {
    if (prefillsApplied.current) return;
    const xc = userNotifications.xClash;
    if (xc?.server || xc?.alliance) {
      setServer(xc.server || '');
      setAlliance(xc.alliance || '');
      prefillsApplied.current = true;
    }
  }, [userNotifications.xClash]);

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

  function resetComposer() {
    setCaption('');
    clearImage();
    setFocused(false);
    setYapType('yap');
  }

  async function onPublish() {
    if (!canPost) return;
    await publishYap({
      userNotifications,
      userDetails,
      caption,
      selectedImage,
      setLoading,
      yapType,
      xClashContext: { server, alliance },
      onDone: resetComposer,
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
            placeholder={yapTypePlaceholder(yapType)}
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
            <div className="mt-2 space-y-2 border-t border-white/[0.08] pt-2">
              <div className="flex flex-wrap gap-1.5">
                {YAP_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={cn(
                      'h-7 rounded-full px-3 text-[12px] font-medium transition-colors',
                      yapType === opt.id
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setYapType(opt.id)}
                    disabled={loading}
                  >
                    {opt.short}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  placeholder="Server"
                  disabled={loading}
                  className="h-8 w-[100px] rounded-[10px] border border-white/[0.12] bg-transparent px-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <input
                  type="text"
                  value={alliance}
                  onChange={(e) => setAlliance(e.target.value)}
                  placeholder="Alliance"
                  disabled={loading}
                  className="h-8 min-w-[120px] flex-1 rounded-[10px] border border-white/[0.12] bg-transparent px-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FeedComposer;
