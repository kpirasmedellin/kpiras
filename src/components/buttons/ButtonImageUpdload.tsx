import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, setImageUrl }) => {
  const handleUploadSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      setImageUrl(result.info.secure_url);
    } else {
      console.error('Error: No se encontró secure_url en el resultado de la carga.');
    }
  };

  const handleUploadError = (error: any) => {
    console.error('Error al cargar la imagen:', error);
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="image" className="block font-semibold mb-2 text-center">
        Imagen del producto:
      </label>
      <CldUploadWidget
        uploadPreset="my_preset"
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      >
        {({ open }) => (
          <button
            type="button"
            className="px-4 py-2 bg-[#67b7f7] text-white rounded-lg hover:bg-[#4b9fea] focus:outline-none"
            onClick={() => open()}
          >
            Cargar imagen
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Vista previa de la imagen del producto"
            className="rounded-md shadow-md"
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
