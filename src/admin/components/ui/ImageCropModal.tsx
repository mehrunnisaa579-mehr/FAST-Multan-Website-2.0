import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import AdminModal from './AdminModal';
import AdminButton from './AdminButton';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  imageFile: File | null;
  aspectRatio?: number; // e.g. 16/9 (1.777), 3/4 (0.75), 1/1 (1.0), 4/3 (1.333)
  cropShape?: 'rect' | 'round';
  title?: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void | Promise<void>;
}

/**
 * Utility to generate cropped File using HTML5 Canvas
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName = 'cropped-image.jpg',
  rotation = 0
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = 'anonymous';

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = (err) => reject(err);
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of rotated image
  const bBoxWidth =
    Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight =
    Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to center for rotation
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw image on canvas
  ctx.drawImage(image, 0, 0);

  // Create canvas for final cropped area
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Could not get cropped canvas context');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Fill with white background
  croppedCtx.fillStyle = '#FFFFFF';
  croppedCtx.fillRect(0, 0, pixelCrop.width, pixelCrop.height);

  // Draw crop area onto final canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const fileType = blob.type || 'image/jpeg';
        const croppedFile = new File([blob], fileName, { type: fileType });
        resolve(croppedFile);
      },
      'image/jpeg',
      0.92
    );
  });
}

export default function ImageCropModal({
  isOpen,
  imageFile,
  aspectRatio = 16 / 9,
  cropShape = 'rect',
  title = 'Crop & Position Image',
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageSrc(null);
    }
  }, [imageFile]);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteHandler = useCallback(
    (_croppedArea: any, croppedAreaPixels: PixelCrop) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setProcessing(true);
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        imageFile?.name || 'cropped-image.jpg',
        rotation
      );
      await onCropComplete(croppedFile);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      alert('Error cropping image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose} disabled={processing}>
            Cancel
          </AdminButton>
          <AdminButton variant="primary" onClick={handleSave} loading={processing}>
            Save & Upload Cropped Image
          </AdminButton>
        </>
      }
    >
      <div className="space-y-4 text-left">
        <p className="text-xs text-[#6B7280]">
          Drag image to adjust position. Scroll or use slider to zoom in/out.
        </p>

        {/* Cropper Container */}
        <div className="relative w-full h-[360px] bg-[#111827] rounded-xl overflow-hidden shadow-inner border border-[#374151]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            restrictPosition={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <ZoomOut className="w-4 h-4 text-[#6B7280]" />
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#0093DD] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-[#6B7280]" />
            <span className="text-xs font-semibold text-[#374151] w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate Control */}
          <button
            type="button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] bg-white border border-[#D1D5DB] rounded-md hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate 90°</span>
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
