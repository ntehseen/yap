import React from 'react';
import imageCompression from 'browser-image-compression';
import { uploadToCloudinary } from './uploadToCloudinary';

interface Props {
  e: React.ChangeEvent<HTMLInputElement>;
  location: string;
  username: string;
  maxWidthOrHeight: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

async function handleUploadToCloud({
  e,
  location,
  username,
  maxWidthOrHeight,
  setLoading,
}: Props) {
  const file = e.target.files?.[0];
  if (!file) {
    return { photoURL: undefined as string | undefined };
  }

  const fileType = file.type;
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  let photoURL: string | undefined;

  if (
    fileType === 'image/png' ||
    fileType === 'image/jpg' ||
    fileType === 'image/jpeg'
  ) {
    setLoading(true);

    try {
      const compressedFile = await imageCompression(file, options);
      photoURL = await uploadToCloudinary(compressedFile, {
        folder: `yap/${location}`,
        publicId: `${username}_${Date.now()}`,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  } else {
    console.log('please only use .png, .jpg, .jpeg file types');
  }

  return { photoURL };
}

interface handleUploadImageProps {
  e: React.ChangeEvent<HTMLInputElement>;
  location: string;
  username: string;
  maxWidthOrHeight: number;
  chatRoomIDs: string[] | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  handleImgURLFunction: (args: {
    url: string;
    username: string;
    chatRoomIDs?: string[] | null;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
  }) => void | Promise<void>;
}

function handleUploadImage({
  e,
  location,
  username,
  maxWidthOrHeight,
  chatRoomIDs,
  setLoading,
  setAddPhoto,
  handleImgURLFunction,
}: handleUploadImageProps) {
  async function handler() {
    const result = await handleUploadToCloud({
      e,
      location,
      username,
      maxWidthOrHeight,
      setLoading,
    });

    if (!result.photoURL) {
      return;
    }

    handleImgURLFunction({
      url: result.photoURL,
      username,
      chatRoomIDs,
      setLoading,
      setAddPhoto,
    });
  }
  handler();
}

export default handleUploadImage;
