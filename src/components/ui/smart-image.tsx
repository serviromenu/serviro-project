import Image from "next/image";

interface SmartImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: "cover" | "contain";
  priority?: boolean;
}

export default function SmartImage({
  src,
  alt = "",
  className = "",
  fill = false,
  width,
  height,
  sizes = "100vw",
  objectFit = "cover",
  priority = false,
}: SmartImageProps) {
  if (!src) return null;

  const common = {
    src,
    alt,
    className,
    sizes,
    style: { objectFit },
    priority,
  };

  if (fill) {
    return <Image {...common} fill />;
  }

  return <Image {...common} width={width ?? 100} height={height ?? 100} />;
}