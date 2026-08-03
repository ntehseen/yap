# 02b — Cloudinary Media Uploads

**Date:** 2026-08-03  
**Phase:** 1 (storage alternative)

## Goal

Use Cloudinary’s free tier for post, profile, and story images instead of Firebase Storage (which requires Blaze billing on new projects).

## Existing behavior

Uploads previously went through Firebase Storage (`posts/`, `profilePhotos/`, `stories/`). Auth and Firestore remain on Firebase.

## Architectural decision

- Browser uploads via **unsigned upload preset** (no API secret in the client)
- Shared helper: `util/uploadToCloudinary.ts`
- Folders: `yap/posts`, `yap/profilePhotos`, `yap/stories`
- Removing a profile photo or story clears Firestore/Auth URLs only (unsigned uploads cannot securely delete Cloudinary assets)

## Files changed

- `util/uploadToCloudinary.ts` (new)
- `util/handleAddNewPost.ts`
- `util/handleUploadImage.ts`
- `util/handleRemoveProfilePhoto.ts`
- `util/handleRemoveStory.ts`
- `next.config.js` — allow `res.cloudinary.com`
- `.env.example` — Cloudinary keys

## How to configure Cloudinary

1. Sign up at [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Dashboard → copy **Cloud name**
3. **Settings → Upload → Upload presets → Add upload preset**
   - Signing mode: **Unsigned**
   - Leave **Overwrite** off (Cloudinary blocks overwrite on unsigned presets)
   - Optional folder: `yap`
   - Save and copy the **Preset name**
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

5. Restart `npm run dev`

## How to test

1. Sign up / sign in (Firebase Auth + Firestore)
2. Upload a profile photo
3. Create a post with an image
4. Confirm the image URL host is `res.cloudinary.com`
5. Confirm Media appears in the Cloudinary Media Library

## Known limitations

- Firebase Storage is unused for new uploads; old Firebase Storage env vars can stay empty
- Deleted profile/story images are not destroyed on Cloudinary (URLs cleared only)
- Unsigned presets are public to anyone who knows cloud name + preset — fine for early Yap; move to signed server uploads before production scale

## Next step

Finish Firebase Auth/Firestore smoke test with Cloudinary media, then continue Phase 2 feed work.
