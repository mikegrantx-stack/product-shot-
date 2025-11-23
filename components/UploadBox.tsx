import React, { useRef, useState } from 'react';
import { UploadedImage } from '../types';

interface UploadBoxProps {
  label: string;
  subLabel: string;
  image: UploadedImage | null;
  onImageChange: (image: UploadedImage | null) => void;
  accept?: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  label,
  subLabel,
  image,
  onImageChange,
  accept = "image/*"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove "data:image/xyz;base64," prefix)
      const base64Data = result.split(',')[1];
      
      onImageChange({
        file,
        previewUrl: result,
        base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-bold text-brand-accent uppercase tracking-widest font-display">{label}</label>
      
      <div
        className={`
          relative w-full h-64 rounded-2xl border-2 border-dashed 
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center p-4
          ${!image ? 'cursor-pointer hover:border-brand-accent hover:bg-brand-primary/20' : 'border-brand-primary bg-brand-panel/50'}
          ${isDragging ? 'border-brand-leaf bg-brand-leaf/10' : 'border-brand-primary/40 bg-brand-panel'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!image ? triggerFileSelect : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {!image ? (
          <div className="flex flex-col items-center gap-3 text-brand-primary">
            <div className="p-4 bg-brand-panel rounded-full shadow-inner pointer-events-none border border-brand-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
            </div>
            <div className="pointer-events-none">
              <p className="font-display uppercase tracking-wide text-lg text-brand-cream">Click or drop image</p>
              <p className="text-sm opacity-70 mt-1">{subLabel}</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full group">
            <img 
              src={image.previewUrl} 
              alt="Uploaded Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg backdrop-blur-sm">
                <button
                  onClick={triggerFileSelect}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-leaf hover:text-brand-dark transition-colors font-display uppercase tracking-wider"
                >
                  Change
                </button>
                <button
                  onClick={removeImage}
                  className="px-4 py-2 bg-red-900/40 text-red-200 border border-red-500/50 rounded-lg font-bold text-sm hover:bg-red-500/50 transition-colors font-display uppercase tracking-wider"
                >
                  Remove
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBox;