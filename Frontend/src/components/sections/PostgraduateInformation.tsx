import React from 'react';
import { FormField } from '../ui/FormField';

export const PostgraduateInformation: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">M.Tech Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <FormField
              name="mtechYearOfJoining"
              label="Year of Joining"
              placeholder="e.g., 2015"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          <div>
            <FormField
              name="mtechYearOfGraduation"
              label="Year of Graduation"
              placeholder="e.g., 2017"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              name="mtechDesignation"
              label="PG Designation"
              placeholder="e.g., M.Tech in Computer Science"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Other PG Degree (if any)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <FormField
              name="otherPGDegree"
              label="Degree Name"
              placeholder="e.g., MBA, Ph.D."
            />
          </div>
          
          <div>
            <FormField
              name="otherPGYearOfJoining"
              label="Year of Joining"
              placeholder="e.g., 2018"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          <div>
            <FormField
              name="otherPGYearOfPassing"
              label="Year of Passing/Expected"
              placeholder="e.g., 2020"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              name="otherPGDesignation"
              label="Designation"
              placeholder="e.g., Ph.D. in Data Science"
            />
          </div>
        </div>
      </div>
    </div>
  );
};