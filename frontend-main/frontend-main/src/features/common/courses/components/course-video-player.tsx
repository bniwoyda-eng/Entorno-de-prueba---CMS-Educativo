import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import {
  FastForward,
  Maximize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import {
  useMaterialProgress,
  useUpdateMaterialProgress,
} from "../courses.queries";
import { IMaterialProgress } from "../courses.types";
import { ButtonText } from "../../../../components";

interface Props {
  materialId: string;
  url: string;
  title: string;
  progress: number;
  onEnded: () => void;
  updateMaterialCompletion: (materialId: string, completed: boolean) => void;
}

export const CourseVideoPlayer = ({
  materialId,
  url,
  title,
  progress,
  onEnded,
  updateMaterialCompletion,
}: Props) => {
  const { data, isError } = useMaterialProgress(materialId);
  const { mutate: updateProgress } =
    useUpdateMaterialProgress(materialId);
  const [materialProgress, setMaterialProgress] =
    useState<IMaterialProgress | null>(null);

  useEffect(() => {
    if (data) setMaterialProgress(data);
  }, [data]);

  useEffect(() => {
    if (isError) console.error("Error fetching material progress");
  }, [isError]);

  const playerRef = useRef<ReactPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // nuevo

  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [initialPlay, setInitialPlay] = useState(true);

  // Efecto para manejar el progreso del video
  // Este efecto se ejecuta cuando el video termina o cuando se actualiza el progreso del material
  useEffect(() => {
    if (materialProgress) {
      const { lastPosition, progressPercentage } = materialProgress;
      if (progressPercentage === 100) {
        setCurrentTime(0);
        setPlaying(true);
      } else {
        setTimeout(() => {
          const roundedLastPosition = Math.floor(lastPosition || 0);
          playerRef.current?.seekTo(roundedLastPosition, "seconds");
          setCurrentTime(roundedLastPosition);
          setPlaying(true);
        }, 1000);
      }
    }
  }, [materialProgress, duration]);

  // Efecto para actualizar el progreso cada 30 segundos
  // Este efecto se ejecuta cuando el video está en reproducción y no ha terminado
  // Se actualiza el progreso cada 30 segundos
  useEffect(() => {
    if (!playing || data?.progressPercentage === 100) return;

    const interval = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime();
      if (currentTime && currentTime > 0) {
        updateProgress({ lastPosition: currentTime, finished: false });
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [materialId, updateProgress, playing, data?.progressPercentage]);

  // Efecto para manejar el progreso del video
  // Este efecto se ejecuta cuando el video termina
  const handleVideoEnd = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      updateProgress({ lastPosition: currentTime, finished: true });
      setCurrentTime(0);
      setPlaying(false);
    }
    onEnded();
  };

  // Efecto para manejar el progreso del video
  // Este efecto se ejecuta cada segundo para actualizar el tiempo actual y el porcentaje reproducido
  useEffect(() => {
    if (playerRef.current !== null) {
      const interval = setInterval(() => {
        const time = playerRef.current?.getCurrentTime();
        if (!time) return;
        setCurrentTime(Math.floor(time));
        if (duration > 0) {
          setPlayed(time / duration);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [duration]);

  // Efecto para manejar el evento de teclado
  // Este efecto se ejecuta cuando se presiona la tecla "Escape" y el video está en pantalla completa
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Funciones para manejar los eventos del reproductor
  const handleFirstPlay = () => {
    if (initialPlay) {
      setPlaying(true);
      setInitialPlay(false);
    }
  };

  // Función para manejar el evento de pausa/reproducción
  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  // Función para manejar el evento de rebobinado/avance rápido
  const handleSeek = (amount: number) => {
    const newTime = Math.min(Math.max(0, currentTime + amount), duration); // Simplificado
    playerRef.current?.seekTo(newTime, "seconds");
  };

  // Función para manejar el evento de pantalla completa
  // Esta función se ejecuta cuando se hace clic en el botón de pantalla completa
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // Función para manejar el evento de clic en la barra de progreso
  // Esta función se ejecuta cuando se hace clic en la barra de progreso
  const handleProgressClick = (e: React.MouseEvent<HTMLProgressElement>) => {
    if (playerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const clickPercentage = clickPosition / rect.width;
      const newTime = clickPercentage * duration;
      playerRef.current.seekTo(newTime);
    }
  };

  // Función para formatear el tiempo en minutos y segundos
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Funciones para manejar el evento de mouse
  // Estas funciones se ejecutan cuando el mouse entra o sale del contenedor del video
  const handleMouseEnter = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Función para manejar el evento de volumen
  // Esta función se ejecuta cuando se hace clic en el botón de volumen
  const handleVolumeToggle = () => {
    if (volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  // Función para marcar el video como completo o incompleto
  // Esta función se ejecuta cuando se hace clic en el botón de marcar como completo/incompleto
  const handleMarkAs = (as: "complete" | "incomplete") => {
    if (as === "complete") {
      updateProgress(
        { lastPosition: duration, finished: true },
        {
          onSuccess: (data) => {
            if (data.progressPercentage === 100) {
              updateMaterialCompletion(materialId, true);
            }
          },
          onSettled() {
            onEnded();
          },
        }
      );
    } else {
      updateMaterialCompletion(materialId, false);
      updateProgress(
        { lastPosition: 0, finished: false },
        {
          onSuccess: (data) => {
            if (data.progressPercentage === 0) {
              updateMaterialCompletion(materialId, false);
              setMaterialProgress(data);
            }
          },
        }
      );
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full aspect-video rounded-xl overflow-hidden border bg-black relative"
      >
        <ReactPlayer
          ref={playerRef}
          playing={playing}
          url={url}
          width="100%"
          height="100%"
          controls={false}
          light={<div className="w-full h-full bg-black" />}
          fallback={<FallbackComponent />}
          playIcon={
            <CustomPlayButton title={title} onClick={handleFirstPlay} />
          }
          onEnded={handleVideoEnd}
          volume={volume}
          playbackRate={playbackRate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={({ played }) => setPlayed(played)}
          onDuration={(d) => setDuration(d)}
        />

        {(playing || showControls) && !initialPlay && (
          <div
            className={`absolute bottom-0 left-0 right-0 text-white text-sm p-2 gap-4 bg-black/60 transform transition-all duration-500 ${
              showControls
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-full pointer-events-none"
            }`}
          >
            <progress value={played} max={1} onClick={handleProgressClick} />
            <div className="flex gap-4 items-center justify-between mt-1">
              <div className="flex gap-4 items-center">
                <button
                  onClick={handlePlayPause}
                  title={playing ? "Pause" : "Play"}
                  aria-label={playing ? "Pause Video" : "Play Video"}
                >
                  {playing ? (
                    <Pause fill="white" className="w-5 h-5" />
                  ) : (
                    <Play fill="white" className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleSeek(-10)}
                  title="Rewind 10s"
                  aria-label="Rewind 10 seconds"
                >
                  <FastForward
                    fill="white"
                    className="w-5 h-5 transform rotate-180"
                  />
                </button>
                <button
                  onClick={() => handleSeek(10)}
                  title="Forward 10s"
                  aria-label="Forward 10 seconds"
                >
                  <FastForward fill="white" className="w-5 h-5" />
                </button>
                <div className="flex gap-4 items-center">
                  <label
                    className="cursor-pointer"
                    onClick={handleVolumeToggle}
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                  >
                    {volume === 0 ? (
                      <VolumeOff className="w-5 h-5" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </label>
                  <input
                    title="Volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume control"
                    className="hidden sm:block w-24 cursor-pointer"
                  />
                  <span className="text-xs select-none leading-none tabular-nums hidden sm:block">
                    {formatTime(currentTime)}
                    <span className="mx-1">/</span>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <select
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-main-400 transition duration-200"
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  aria-label="Playback rate"
                >
                  <option className="bg-gray-800 text-white" value={0.5}>
                    0.5x
                  </option>
                  <option className="bg-gray-800 text-white" value={1}>
                    1x
                  </option>
                  <option className="bg-gray-800 text-white" value={1.5}>
                    1.5x
                  </option>
                  <option className="bg-gray-800 text-white" value={2}>
                    2x
                  </option>
                </select>

                <button
                  onClick={handleFullscreen}
                  title="Fullscreen"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="flex items-center justify-center gap-2 my-3 text-center">
          {progress === 100 ? (
            <ButtonText
              text="Marcar como incompleto"
              className="border border-main-400 text-main-400 rounded py-1 px-2 text-sm"
              onClick={() => handleMarkAs("incomplete")}
            />
          ) : (
            <ButtonText
              text="Marcar como completo"
              className="bg-main-400 text-white rounded py-1 px-2 text-sm hover:text-white"
              onClick={() => handleMarkAs("complete")}
            />
          )}
        </div>
      )}
    </div>
  );
};

const CustomPlayButton = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => (
  <div
    className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-main-400 hover:bg-main-300">
      <Play fill="white" className="w-10 h-10 text-white" />
    </div>
    <div className="text-gray-500 text-lg mt-2">{title}</div>
  </div>
);

const FallbackComponent = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="loader" />
    <span className="text-white mt-2">Cargando video...</span>
  </div>
);
