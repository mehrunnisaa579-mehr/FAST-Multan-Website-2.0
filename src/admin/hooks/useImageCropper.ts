import { useState } from 'react';

export interface CropOptions {
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
  title?: string;
}

export function useImageCropper() {
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [options, setOptions] = useState<CropOptions>({
    aspectRatio: 16 / 9,
    cropShape: 'rect',
    title: 'Crop & Position Image',
  });
  const [onCropDoneCallback, setOnCropDoneCallback] = useState<((file: File) => void | Promise<void>) | null>(null);

  const openCropper = (
    e: React.ChangeEvent<HTMLInputElement>,
    onDone: (croppedFile: File) => void | Promise<void>,
    opts?: CropOptions
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropFile(file);
    setOnCropDoneCallback(() => onDone);
    setOptions({
      aspectRatio: opts?.aspectRatio ?? 16 / 9,
      cropShape: opts?.cropShape ?? 'rect',
      title: opts?.title ?? 'Crop & Position Image',
    });
    e.target.value = '';
  };

  const closeCropper = () => {
    setCropFile(null);
    setOnCropDoneCallback(null);
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (onCropDoneCallback) {
      await onCropDoneCallback(croppedFile);
    }
    closeCropper();
  };

  return {
    cropFile,
    cropperProps: {
      isOpen: !!cropFile,
      imageFile: cropFile,
      aspectRatio: options.aspectRatio,
      cropShape: options.cropShape,
      title: options.title,
      onClose: closeCropper,
      onCropComplete: handleCropComplete,
    },
    openCropper,
  };
}
