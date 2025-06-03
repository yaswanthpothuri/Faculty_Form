import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="hidden sm:block">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index < currentStep 
                  ? 'bg-blue-600' 
                  : index === currentStep 
                    ? 'bg-blue-600 ring-4 ring-blue-100' 
                    : 'bg-gray-200'
              } transition-all duration-300`}>
                {index < currentStep ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    index === currentStep ? 'text-white' : 'text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                } transition-all duration-300`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};