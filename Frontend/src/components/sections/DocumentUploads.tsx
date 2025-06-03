import React from 'react';
import { FileUpload } from '../ui/FileUpload';

export const DocumentUploads: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Required Documents</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FileUpload
            name="profilePicture"
            label="Profile Picture"
            accept=".jpg,.jpeg,.png"
            showPreview={true}
            previewName="profilePicturePreview"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Please upload a recent passport-size photograph (JPEG/PNG format)
          </p>
        </div>
        
        <div>
          <FileUpload
            name="resume"
            label="Resume / CV"
            accept=".pdf,.doc,.docx"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload your detailed CV in PDF or Word format
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Document Requirements:</h4>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Profile picture must be a recent passport-size photo</li>
          <li>Maximum file size: 5MB for images, 10MB for documents</li>
          <li>Supported formats: JPEG, PNG for images; PDF, DOC, DOCX for resume</li>
          <li>Ensure all documents are clear and legible</li>
        </ul>
      </div>
    </div>
  );
};