import React from 'react';
import { useFormContext } from 'react-hook-form';

export const FormSummary: React.FC = () => {
  const { watch } = useFormContext();
  const formData = watch();
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-sm text-blue-700">
          Please review your information below. If everything looks correct, click the "Submit Application" button. 
          Otherwise, use the "Back" button to make corrections.
        </p>
      </div>
      
      <div className="space-y-6">
        <SummarySection title="Personal Information">
          <SummaryItem label="Full Name" value={formData.fullName} />
          <SummaryItem label="Gender" value={formData.gender} />
          <SummaryItem label="Date of Birth" value={formData.dateOfBirth} />
          <SummaryItem label="Age" value={formData.age} />
          <SummaryItem label="Email" value={formData.email} />
          <SummaryItem label="Phone" value={formData.phone} />
          <SummaryItem label="Position" value={formData.position} />
          <SummaryItem label="Application Type" value={formData.applicationType} />
          <SummaryItem 
            label="Profile Picture" 
            value={formData.profilePicture?.name || 'Not uploaded'} 
            isFile={!!formData.profilePicture}
          />
          <SummaryItem 
            label="Resume" 
            value={formData.resume?.name || 'Not uploaded'} 
            isFile={!!formData.resume}
          />
        </SummarySection>
        
        <SummarySection title="Education">
          <SummaryItem label="B.Tech CGPA" value={formData.btechCGPA} />
          
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-500">10th Standard Details</h4>
            <div className="mt-1 pl-4 border-l-2 border-gray-200">
              <SummaryItem label="School Name" value={formData.tenthSchoolName} />
              <SummaryItem label="Place" value={formData.tenthPlace} />
              <SummaryItem label="Timeline" value={formData.tenthTimeline} />
              <SummaryItem label="Percentage" value={`${formData.tenthPercentage}%`} />
            </div>
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-500">Intermediate Details</h4>
            <div className="mt-1 pl-4 border-l-2 border-gray-200">
              <SummaryItem label="College Name" value={formData.interCollegeName} />
              <SummaryItem label="Place" value={formData.interPlace} />
              <SummaryItem label="Timeline" value={formData.interTimeline} />
              <SummaryItem label="Percentage" value={`${formData.interPercentage}%`} />
            </div>
          </div>
        </SummarySection>
        
        <SummarySection title="Postgraduate Information">
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-500">M.Tech Details</h4>
            <div className="mt-1 pl-4 border-l-2 border-gray-200">
              <SummaryItem label="Year of Joining" value={formData.mtechYearOfJoining} />
              <SummaryItem label="Year of Graduation" value={formData.mtechYearOfGraduation} />
              <SummaryItem label="Designation" value={formData.mtechDesignation} />
            </div>
          </div>
          
          {formData.otherPGDegree && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-500">Other PG Degree</h4>
              <div className="mt-1 pl-4 border-l-2 border-gray-200">
                <SummaryItem label="Degree" value={formData.otherPGDegree} />
                <SummaryItem label="Year of Joining" value={formData.otherPGYearOfJoining} />
                <SummaryItem label="Year of Passing" value={formData.otherPGYearOfPassing} />
                <SummaryItem label="Designation" value={formData.otherPGDesignation} />
              </div>
            </div>
          )}
        </SummarySection>
        
        <SummarySection title="Academic Experience">
          {!formData.hasExperience && (
            <p className="text-gray-600 italic">No experience provided</p>
          )}
          
          {formData.hasExperience && formData.experiences && formData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mt-2">
              <h4 className="text-sm font-medium text-gray-500">Experience {index + 1}</h4>
              <div className="mt-1 pl-4 border-l-2 border-gray-200">
                <SummaryItem label="Designation" value={exp.designation} />
                <SummaryItem label="Institution" value={exp.institution} />
                <SummaryItem label="Place" value={exp.place} />
                <SummaryItem label="From Date" value={exp.fromDate} />
                <SummaryItem label="To Date" value={exp.toDate} />
              </div>
            </div>
          ))}
        </SummarySection>
      </div>
    </div>
  );
};

interface SummarySectionProps {
  title: string;
  children: React.ReactNode;
}

const SummarySection: React.FC<SummarySectionProps> = ({ title, children }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

interface SummaryItemProps {
  label: string;
  value: string | number | undefined;
  isFile?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, isFile = false }) => {
  if (!value && value !== 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className={`text-sm ${isFile ? 'text-blue-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
};