import React, { useEffect, useRef } from 'react';
import { FormField } from '../ui/FormField';

// Add this interface to your global types or props
interface PostgraduateInformationProps {
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const PostgraduateInformation: React.FC<PostgraduateInformationProps> = ({ 
  onValidationChange 
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  // Function to get current form values
  const getCurrentValues = () => {
    if (!formRef.current) return {};
    
    const inputs = formRef.current.querySelectorAll('input, select, textarea');
    const values: Record<string, string> = {};
    
    inputs.forEach((input: any) => {
      if (input.name) {
        values[input.name] = input.value || '';
      }
    });
    
    return values;
  };

  // Function to validate the form
  const validateForm = () => {
    const values = getCurrentValues();
    const errors: string[] = [];

    // Check if any M.Tech field has a value
    const hasMTechData = Boolean(
      values.mtechCollege?.trim() ||
      values.mtechDesignation?.trim() ||
      values.mtechYearOfJoining?.trim() ||
      values.mtechYearOfGraduation?.trim() ||
      values.mtechCgpa?.trim()
    );

    // Check if any Other PG field has a value
    const hasOtherPGData = Boolean(
      values.otherPGDegree?.trim() ||
      values.otherpgcollege?.trim() ||
      values.otherPGDesignation?.trim() ||
      values.otherPGYearOfJoining?.trim() ||
      values.otherPGYearOfPassing?.trim() ||
      values.otherPGCgpa?.trim()
    );

    // Validate M.Tech fields if any M.Tech data is present
    if (hasMTechData) {
      const mtechFields = [
        { name: 'mtechCollege', label: 'M.Tech College/University' },
        { name: 'mtechDesignation', label: 'M.Tech Branch/Specialization' },
        { name: 'mtechYearOfJoining', label: 'M.Tech Year of Joining' },
        { name: 'mtechYearOfGraduation', label: 'M.Tech Year of Graduation' },
        { name: 'mtechCgpa', label: 'M.Tech CGPA' }
      ];

      mtechFields.forEach(field => {
        if (!values[field.name]?.trim()) {
          errors.push(`${field.label} is required when any M.Tech detail is provided`);
        }
      });

      // Additional M.Tech validations
      if (values.mtechYearOfJoining && !/^\d{4}$/.test(values.mtechYearOfJoining)) {
        errors.push('M.Tech Year of Joining must be a valid 4-digit year');
      }
      if (values.mtechYearOfGraduation && !/^\d{4}$/.test(values.mtechYearOfGraduation)) {
        errors.push('M.Tech Year of Graduation must be a valid 4-digit year');
      }
      if (values.mtechCgpa) {
        const cgpa = parseFloat(values.mtechCgpa);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
          errors.push('M.Tech CGPA must be between 0 and 10');
        }
      }
    }

    // Validate Other PG fields if any Other PG data is present
    if (hasOtherPGData) {
      const otherPGFields = [
        { name: 'otherPGDegree', label: 'Other PG Degree Name' },
        { name: 'otherpgcollege', label: 'Other PG College/University' },
        { name: 'otherPGDesignation', label: 'Other PG Branch/Specialization' },
        { name: 'otherPGYearOfJoining', label: 'Other PG Year of Joining' },
        { name: 'otherPGYearOfPassing', label: 'Other PG Year of Passing' },
        { name: 'otherPGCgpa', label: 'Other PG CGPA' }
      ];

      otherPGFields.forEach(field => {
        if (!values[field.name]?.trim()) {
          errors.push(`${field.label} is required when any Other PG detail is provided`);
        }
      });

      // Additional Other PG validations
      if (values.otherPGYearOfJoining && !/^\d{4}$/.test(values.otherPGYearOfJoining)) {
        errors.push('Other PG Year of Joining must be a valid 4-digit year');
      }
      if (values.otherPGYearOfPassing && !/^\d{4}$/.test(values.otherPGYearOfPassing)) {
        errors.push('Other PG Year of Passing must be a valid 4-digit year');
      }
      if (values.otherPGCgpa) {
        const cgpa = parseFloat(values.otherPGCgpa);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
          errors.push('Other PG CGPA must be between 0 and 10');
        }
      }
    }

    const isValid = errors.length === 0;
    
    if (onValidationChange) {
      onValidationChange(isValid, errors);
    }

    return { isValid, errors, hasMTechData, hasOtherPGData };
  };

  // Set up event listeners for form changes
  useEffect(() => {
    const handleFormChange = () => {
      setTimeout(validateForm, 100); // Small delay to ensure value is updated
    };

    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', handleFormChange);
        input.addEventListener('change', handleFormChange);
        input.addEventListener('blur', handleFormChange);
      });

      // Initial validation
      validateForm();

      // Cleanup
      return () => {
        inputs.forEach(input => {
          input.removeEventListener('input', handleFormChange);
          input.removeEventListener('change', handleFormChange);
          input.removeEventListener('blur', handleFormChange);
        });
      };
    }
  }, []);

  const { hasMTechData, hasOtherPGData } = validateForm();

  return (
    <div ref={formRef} className="space-y-6 animate-fadeIn">
      <p className='text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-200'>
        <strong>Note:</strong> If you haven't done post graduation, please go to the next section.
      </p>
      
      {/* M.Tech Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">M.Tech Details</h3>
        {hasMTechData && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-md border border-orange-200 mt-2">
            <strong>⚠️ Important:</strong> Since you've started filling M.Tech details, all M.Tech fields are now required.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          
          {/* College/University - Full width */}
          <div className="md:col-span-2">
            <FormField
              name='mtechCollege'
              label='College/University *'
              placeholder='Enter college/university name'
            />
          </div>
          
          {/* Branch/Specialization - Full width */}
          <div className="md:col-span-2">
            <FormField
              name="mtechDesignation"
              label="M.Tech Branch/Specialization *"
              placeholder="e.g., Computer Science, Electronics, Mechanical"
            />
          </div>
          
          {/* Year of Joining */}
          <div>
            <FormField
              name="mtechYearOfJoining"
              label="Year of Joining *"
              placeholder="e.g., 2015"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          {/* Year of Graduation */}
          <div>
            <FormField
              name="mtechYearOfGraduation"
              label="Year of Graduation *"
              placeholder="e.g., 2017"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          {/* CGPA */}
          <div>
            <FormField
              name="mtechCgpa"
              label="M.Tech CGPA *"
              type="number"
              placeholder="e.g., 8.5"
              min={0}
              max={10}
              step={0.01}
            />
            <p className="text-xs text-gray-500 mt-1">Out of 10</p>
          </div>
          
        </div>
      </div>

      {/* Other PG Degree Section */}
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Other PG Degree (if any)</h3>
        {hasOtherPGData && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-md border border-orange-200 mt-2">
            <strong>⚠️ Important:</strong> Since you've started filling Other PG details, all Other PG fields are now required.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          
          {/* Degree Name */}
          <div>
            <FormField
              name="otherPGDegree"
              label="Degree Name *"
              placeholder="e.g., MBA, Ph.D., M.Sc"
            />
          </div>
          
          {/* College/University */}
          <div>
            <FormField
              name='otherpgcollege'
              label='College/University *'
              placeholder='Enter college/university name'
            />
          </div>
          
          {/* Branch/Specialization - Full width */}
          <div className="md:col-span-2">
            <FormField
              name="otherPGDesignation"
              label="Branch/Specialization *"
              placeholder="e.g., Data Science, Finance, Marketing"
            />
          </div>
          
          {/* Year of Joining */}
          <div>
            <FormField
              name="otherPGYearOfJoining"
              label="Year of Joining *"
              placeholder="e.g., 2018"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          {/* Year of Passing */}
          <div>
            <FormField
              name="otherPGYearOfPassing"
              label="Year of Passing/Expected *"
              placeholder="e.g., 2020"
              pattern={/^\d{4}$/}
              patternMessage="Please enter a valid year (YYYY)"
            />
          </div>
          
          {/* CGPA */}
          <div>
            <FormField
              name="otherPGCgpa"
              label="CGPA *"
              type="number"
              placeholder="e.g., 8.5"
              min={0}
              max={10}
              step={0.01}
            />
            <p className="text-xs text-gray-500 mt-1">Out of 10</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};