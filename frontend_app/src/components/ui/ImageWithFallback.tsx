'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { theme } from './theme';

type Props = Omit<ImageProps, 'onError'> & {
  fallbackSrc?: string | StaticImport;
  onImageErrorSrc?: string | StaticImport;
};

const DEFAULT_FALLBACK: string =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="${theme.colors.background}"/>
      <g fill="${theme.colors.mutedText}" font-family="Arial, Helvetica, sans-serif">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18">Image unavailable</text>
      </g>
    </svg>`
  );

// PUBLIC_INTERFACE
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  onImageErrorSrc,
  ...rest
}: Props) {
  /** Accessible Image component with built-in error fallback and blur placeholder. */
  const initialSrc: string | StaticImport =
    typeof src === 'string' ? src : (src as StaticImport);

  const [imgSrc, setImgSrc] = React.useState<string | StaticImport>(initialSrc);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(typeof src === 'string' ? src : (src as StaticImport));
    setErrored(false);
  }, [src]);

  const effectiveSrc: string | StaticImport =
    errored ? (onImageErrorSrc || fallbackSrc || (DEFAULT_FALLBACK as string)) : imgSrc;

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={alt || 'Image'}
      onError={() => {
        setErrored(true);
      }}
      placeholder="blur"
      blurDataURL={
        typeof effectiveSrc === 'string' && effectiveSrc.toString().startsWith('data:image')
          ? (effectiveSrc as string)
          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnpzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0iYiI+RmU8L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U1ZTdlYiIvPjwvc3ZnPg=='
      }
      style={{
        objectFit: (('objectFit' in rest && typeof (rest as { objectFit?: string }).objectFit === 'string')
          ? (rest as { objectFit?: string }).objectFit
          : 'cover') as React.CSSProperties['objectFit'],
      }}
    />
  );
}

export default ImageWithFallback;
