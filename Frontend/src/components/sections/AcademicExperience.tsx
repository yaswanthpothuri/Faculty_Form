import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Plus, Trash2 } from 'lucide-react';

export const AcademicExperience: React.FC = () => {
  const { control, watch } = useFormContext();
  const hasExperience = watch('hasExperience');
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences'
  });
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Academic Experience</h3>
      
      <div>
        <FormField
          name="hasExperience"
          label="Do you have experience after B.Tech or M.Tech?"
          type="checkbox"
        />
      </div>
      
      {hasExperience && (
        <div className="space-y-6">
          <h4 className="text-md font-medium text-gray-700">Experience Details</h4>
          
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-gray-800">Experience {index + 1}</h5>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    name={`experiences.${index}.designation`}
                    label="Designation"
                    placeholder="e.g., Assistant Professor"
                    required={hasExperience}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormField
                    name={`experiences.${index}.institution`}
                    label="Institution/Organization Name"
                    placeholder="Enter the name of the institution"
                    required={hasExperience}
                  />
                </div>
                
                <div>
                  <FormField
                    name={`experiences.${index}.place`}
                    label="Place"
                    placeholder="Enter location"
                    required={hasExperience}
                  />
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      name={`experiences.${index}.fromDate`}
                      label="From Date"
                      type="date"
                      required={hasExperience}
                    />
                  </div>
                  
                  <div>
                    <FormField
                      name={`experiences.${index}.toDate`}
                      label="To Date"
                      type="date"
                      required={hasExperience}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => append({ 
                designation: '', 
                institution: '', 
                place: '', 
                fromDate: '', 
                toDate: '' 
              })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Experience
            </button>
          </div>
        </div>
      )}
      
      {!hasExperience && (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No experience information needed. You can proceed to the next section.</p>
        </div>
      )}
    </div>
  );
};