/**
 * Browser upload to Cloudinary via an unsigned upload preset.
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
 */

export class CloudinaryConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudinaryConfigError';
  }
}

function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new CloudinaryConfigError(
      'Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.'
    );
  }

  return { cloudName, uploadPreset };
}

interface UploadOptions {
  /** Cloudinary folder, e.g. yap/posts */
  folder: string;
  /**
   * Optional public id. Must be unique for unsigned presets
   * (overwrite is not allowed on unsigned uploads).
   */
  publicId?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  error?: { message: string };
}

function uniqueSuffix() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function uploadToCloudinary(
  file: File | Blob,
  { folder, publicId }: UploadOptions
): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  // Always unique — unsigned presets cannot overwrite existing public_ids
  formData.append('public_id', publicId || uniqueSuffix());

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }

  return data.secure_url;
}
