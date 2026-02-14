export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export function resizeImage(file: File, options: ResizeOptions = {}): Promise<File> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.8, format = 'jpeg' } = options;
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      let width = img.width, height = img.height;
      if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
      if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: `image/${format}`, lastModified: Date.now() }));
        else reject(new Error('Failed to compress image'));
      }, `image/${format}`, quality);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
