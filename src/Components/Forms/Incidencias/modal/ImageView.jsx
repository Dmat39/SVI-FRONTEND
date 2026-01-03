import React, { useEffect, useMemo, useState } from 'react'
import CustomModal from '../../../Modal/CustomModal'
import { useSelector } from 'react-redux'
import { incidenceApi } from '../../../helpers/axiosConfig'
import { getToken } from '../../../helpers/axiosConfig'
import heic2any from "heic2any"
// Helper function to detect if file is HEIC
const isHeicFile = (filename) => {
  return filename && (filename.toLowerCase().includes('.heic') || filename.toLowerCase().includes('.heif'));
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

const ImageView = ({open,handleClose, foto, isVideo = false}) => {
  const reduxToken = useSelector((state) => state.auth.token)
  const authToken = useMemo(() => reduxToken || getToken(), [reduxToken])
  const [blobUrl, setBlobUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isActive = true
    const fetchBlob = async () => {
      if (!foto) return
      setIsLoading(true)
      try {
        const response = await incidenceApi.get(`/incidencias/fotos/${foto.replace('preincidencias/fotos/', '')}`, {
          responseType: 'blob',
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        })
        if (!isActive) return
        
        let finalBlob = response.data;
        
        // Convert HEIC files to JPEG
        if (isHeicFile(foto)) {
          finalBlob = await convertHeicToJpeg(response.data);
        }
        
        const url = URL.createObjectURL(finalBlob)
        setBlobUrl(url)
      } catch (error) {
        console.error('Error loading image:', error);
        setBlobUrl('')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlob()
    return () => {
      isActive = false
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [foto, authToken])

  return (
    <CustomModal className="w-[90%] max-w-4xl" Open={open} handleClose={handleClose} >
        <div className="bg-white rounded-lg p-4 flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                {isHeicFile(foto) ? 'Convirtiendo imagen HEIC...' : 'Cargando...'}
              </span>
            </div>
          ) : isVideo ? (
            <video 
              src={blobUrl} 
              controls 
              autoPlay
              className="w-full max-h-[70vh] object-contain rounded-md"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          ) : (
            <img 
              src={blobUrl} 
              alt="Imagen preincidencia" 
              className="w-full max-h-[70vh] object-contain rounded-md"
            />
          )}
        </div>
    </CustomModal>
  )
}

export default ImageView
