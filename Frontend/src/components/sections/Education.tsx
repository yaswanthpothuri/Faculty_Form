import React from 'react';
import { FormField } from '../ui/FormField';

export const Education: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">B.Tech Details</h3>
        <div className="mt-4">
          <FormField
            name="btechCGPA"
            label="B.Tech CGPA"
            type="number"
            placeholder="Enter your CGPA (e.g., 8.5)"
            required
            min={0}
            max={10}
            // step={0.01}
          />
        </div>
      </div>
      
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">10th Standard Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <FormField
              name="tenthSchoolName"
              label="School Name"
              placeholder="Enter your school name"
              required
            />
          </div>
          
          <div>
            <FormField
              name="tenthPlace"
              label="Place"
              placeholder="Enter school location"
              required
            />
          </div>
          
          <div>
            <FormField
              name="tenthTimeline"
              label="Timeline"
              placeholder="e.g., 2010-2011"
              required
              pattern={/^\d{4}-\d{4}$/}
              patternMessage="Please use format YYYY-YYYY"
            />
          </div>
          
          <div>
            <FormField
              name="tenthPercentage"
              label="Percentage"
              type="number"
              placeholder="Enter percentage (e.g., 85)"
              required
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Intermediate (12th) Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <FormField
              name="interCollegeName"
              label="College Name"
              placeholder="Enter your college name"
              required
            />
          </div>
          
          <div>
            <FormField
              name="interPlace"
              label="Place"
              placeholder="Enter college location"
              required
            />
          </div>
          
          <div>
            <FormField
              name="interTimeline"
              label="Timeline"
              placeholder="e.g., 2012-2013"
              required
              pattern={/^\d{4}-\d{4}$/}
              patternMessage="Please use format YYYY-YYYY"
            />
          </div>
          
          <div>
            <FormField
              name="interPercentage"
              label="Percentage"
              type="number"
              placeholder="Enter percentage (e.g., 85)"
              required
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};