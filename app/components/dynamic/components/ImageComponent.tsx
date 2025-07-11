"use client";

interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageComponent({
  src,
  alt,
  width,
  height,
  className = "",
}: ImageComponentProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
    />
  );
}
