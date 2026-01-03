import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useMemo, useState } from "react";
import ImageView from "../modal/ImageView.jsx";
import { useSelector } from "react-redux";
import { getToken } from "../../../helpers/axiosConfig";
import { incidenceApi } from "../../../helpers/axiosConfig";
import heic2any from "heic2any";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Helper function to detect if file is video
const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
  return videoExtensions.some(ext => filename.toLowerCase().includes(ext));
};

// Helper function to detect if file is image
const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.heic'];
  return imageExtensions.some(ext => filename.toLowerCase().includes(ext));
};

// Helper function to detect if file is HEIC
const isHeicFile = (filename) => {
  return filename.toLowerCase().includes('.heic') || filename.toLowerCase().includes('.heif');
};

// Function to convert HEIC to JPEG
const convertHeicToJpeg = async (blob) => {
  try {
    const convertedBlob = await heic2any({
      blob: blob,
      toType: "image/jpeg",
      quality: 0.8
    });
    return convertedBlob;
  } catch (error) {
    console.error('Error converting HEIC:', error);
    return blob; // Return original blob if conversion fails
  }
};

const MediaSwiper = ({ images }) => {
  const [openImage, setOpenImage] = useState(false)
  const [imagenURL, setImagenURL] = useState(null)
  const [isCurrentItemVideo, setIsCurrentItemVideo] = useState(false)
  const [mediaBlobUrlByPath, setMediaBlobUrlByPath] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const reduxToken = useSelector((state) => state.auth.token)
  const authToken = useMemo(() => reduxToken || getToken(), [reduxToken])

  const handleCloseImageView = () => {
    setOpenImage(false)
  }

  const handleMediaClick = (mediaItem) => {
    setOpenImage(true)
    setImagenURL(mediaItem)
    setIsCurrentItemVideo(isVideoFile(mediaItem))
  }

  useEffect(() => {
    let isActive = true
    if (!images || images.length === 0) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadingProgress(0)

    const fetchAll = async () => {
      try {
        const totalImages = images.length
        let completedImages = 0

        const results = await Promise.all(
          images.map(async (path) => {
            try {
              const response = await incidenceApi.get(`/incidencias/fotos/${path.replace('preincidencias/fotos/', '')}`, {
                responseType: 'blob',
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
              })

              let finalBlob = response.data;

              // Convert HEIC files to JPEG
              if (isHeicFile(path)) {
                finalBlob = await convertHeicToJpeg(response.data);
              }

              const url = URL.createObjectURL(finalBlob)

              // Update progress
              completedImages++
              if (isActive) {
                setLoadingProgress((completedImages / totalImages) * 100)
              }

              return [path, url]
            } catch (e) {
              console.error(`Error processing ${path}:`, e);
              completedImages++
              if (isActive) {
                setLoadingProgress((completedImages / totalImages) * 100)
              }
              return [path, null]
            }
          })
        )
        if (!isActive) return
        const map = Object.fromEntries(results)
        setMediaBlobUrlByPath(map)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching media:', error);
        setIsLoading(false)
      }
    }
    fetchAll()
    return () => {
      isActive = false
      Object.values(mediaBlobUrlByPath).forEach((u) => u && URL.revokeObjectURL(u))
    }
  }, [images, authToken])

  return (
    <>
      <div className="h-[400px] relative">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <div className="text-center">
              <p className="text-gray-700 font-medium mb-2">Cargando imágenes...</p>
              <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {Math.round(loadingProgress)}% completado
                {images.some(img => isHeicFile(img))}
              </p>
            </div>
          </div>
        ) : (
          <Swiper
            className="h-full"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {images.map((mediaItem, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[400px] w-full overflow-hidden !cursor-pointer"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.3) transparent",
                  }}
                  onClick={() => handleMediaClick(mediaItem)}
                >
                  {isVideoFile(mediaItem) ? (
                    <video
                      src={mediaBlobUrlByPath[mediaItem] || ''}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <img
                      src={mediaBlobUrlByPath[mediaItem] || ''}
                      alt={`Slide ${index}`}
                      className="w-full h-full object-cover"
                      style={{
                        WebkitScrollbar: { width: "2px", height: "2px" },
                        WebkitScrollbarThumb: {
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "10px",
                        },
                        WebkitScrollbarTrack: { background: "transparent" },
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Flechas de navegación centradas - solo mostrar cuando no está cargando */}
        {!isLoading && (
          <>
            <div className="swiper-button-prev absolute top-1/2 left-2 z-10" />
            <div className="swiper-button-next absolute top-1/2 right-2 z-10" />
          </>
        )}
      </div>
      <ImageView open={openImage} handleClose={handleCloseImageView} foto={imagenURL} isVideo={isCurrentItemVideo}></ImageView>
    </>
  );
};

export default MediaSwiper;
