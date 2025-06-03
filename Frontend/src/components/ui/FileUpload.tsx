import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  name: string;
  label: string;
  accept?: string;
  required?: boolean;
  showPreview?: boolean;
  previewName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  name, 
  label, 
  accept = '', 
  required = false,
  showPreview = false,
  previewName
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  
  const file = watch(name);
  const preview = previewName ? watch(previewName) : null;
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };
  
  const handleFileChange = (selectedFile: File) => {
    setValue(name, selectedFile, { shouldValidate: true });
    
    if (showPreview && previewName) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue(previewName, e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const removeFile = () => {
    setValue(name, null);
    if (previewName) {
      setValue(previewName, '');
    }
  };
  
  const containerClasses = clsx(
    "border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center cursor-pointer",
    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
    errors[name] && "border-red-300"
  );
  
  const id = `file-${name}`;
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-4">
        {!file && (
          <div
            className={containerClasses}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById(id)?.click()}
          >
            <input
              id={id}
              type="file"
              accept={accept}
              className="hidden"
              {...register(name, { required: required && 'This file is required' })}
              onChange={handleInputChange}
            />
            
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your file here, or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept ? `Accepted formats: ${accept.replace(/\./g, '')}` : 'All file types accepted'}
            </p>
          </div>
        )}
        
        {file && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {showPreview && preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md mx-auto border border-gray-200"
            />
          </div>
        )}
        
        {errors[name] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
};