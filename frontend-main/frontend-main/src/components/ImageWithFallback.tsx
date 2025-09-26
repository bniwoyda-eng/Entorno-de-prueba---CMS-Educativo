import { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  fallbackSrc?: string;
  loaderClassName?: string;
  imageClassName?: string;
};

export const ImageWithFallback = ({
  src,
  alt,
  title,
  className = "w-full object-cover h-96",
  fallbackSrc = "/default-fallback-image.png", // Reemplaza con una imagen local si querés
  loaderClassName = "bg-gray-200 animate-pulse",
  imageClassName = "",
}: ImageWithFallbackProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {!loaded && !error && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-center rounded-xl z-10 ${loaderClassName}`}
        >
          <span className="text-sm text-gray-400">Cargando imagen...</span>
        </div>
      )}

      {/* Imagen principal o fallback */}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        title={title}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${imageClassName} ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
