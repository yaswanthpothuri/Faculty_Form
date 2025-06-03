import React from 'react';
import { FormField } from '../ui/FormField';

const positions = [
  { value: 'assistant_professor', label: 'Assistant Professor' },
  { value: 'associate_professor', label: 'Associate Professor' },
  { value: 'professor', label: 'Professor' },
  { value: 'head_of_department', label: 'Head of Department' },
  { value: 'dean', label: 'Dean' },
  { value: 'research_faculty', label: 'Research Faculty' },
  { value: 'visiting_faculty', label: 'Visiting Faculty' },
];

export const PersonalInformation: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <FormField
            name="gender"
            label="Gender"
            type="radio"
            required
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </div>
        
        <div>
          <FormField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            required
          />
        </div>

        <div>
          <FormField
            name="age"
            label="Age"
            type="number"
            placeholder="Enter your age"
            required
            min={20}
            max={70}
          />
        </div>
        
        <div>
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            required
            pattern={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
            patternMessage="Please enter a valid email address"
          />
        </div>
        
        <div>
          <FormField
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            required
            pattern={/^[0-9]{10}$/}
            patternMessage="Please enter a valid 10-digit phone number"
          />
        </div>

        <div>
          <FormField
            name="position"
            label="Position Applying For"
            type="select"
            required
            options={positions}
          />
        </div>

        <div>
          <FormField
            name="applicationType"
            label="Application Type"
            type="radio"
            required
            options={[
              { value: 'technical', label: 'Technical' },
              { value: 'non_technical', label: 'Non-Technical' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};