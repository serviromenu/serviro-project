interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  preserveTransparency?: boolean;
  maxFileSizeMB?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.75,
    preserveTransparency = false,
    maxFileSizeMB = 2,
  } = options;

  if (!file.type.startsWith("image/")) {
    throw new Error("فایل انتخاب‌شده تصویر نیست.");
  }

  if (file.size > maxFileSizeMB * 1024 * 1024) {
    throw new Error(`حجم تصویر نباید بیشتر از ${maxFileSizeMB}MB باشد.`);
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);

    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(
        maxWidth / width,
        maxHeight / height
      );

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context unavailable");
    }

    ctx.drawImage(img, 0, 0, width, height);

    const usePng =
      preserveTransparency || file.type === "image/png";

    const outputType = usePng
      ? "image/png"
      : "image/webp";

    const blob = await canvasToBlob(
      canvas,
      outputType,
      outputType === "image/webp" ? quality : undefined
    );

    const extension = outputType === "image/webp"
      ? "webp"
      : "png";

    const originalName = file.name.replace(/\.[^/.]+$/, "");

    return new File(
      [blob],
      `${originalName}.${extension}`,
      {
        type: outputType,
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Image load failed"));

    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}