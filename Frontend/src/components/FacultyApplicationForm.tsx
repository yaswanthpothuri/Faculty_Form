// FacultyApplicationForm.tsx
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import { CheckCircle, ChevronRight } from 'lucide-react';

import { PersonalInformation } from './sections/PersonalInformation';
import { Education } from './sections/Education';
import { AcademicExperience } from './sections/AcademicExperience';
import { DocumentUploads } from './sections/DocumentUploads';
import { ProgressBar } from './ui/ProgressBar';
import { PostgraduateInformation } from './sections/PostgraduateInformation';
import { FormSummary } from './sections/FormSummary';

type FormData = {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  email: string;
  phone: string;
  position: string;
  applicationType: string;
  profilePicture: File | null;
  profilePicturePreview: string;
  resume: File | null;
  
  // Academic fields
  btechCGPA: string;
  tenthSchoolName: string;
  tenthPlace: string;
  tenthTimeline: string;
  tenthPercentage: string;
  interCollegeName: string;
  interPlace: string;
  interTimeline: string;
  interPercentage: string;
  
  mtechYearOfJoining: string;
  mtechYearOfGraduation: string;
  mtechDesignation: string;
  otherPGDegree: string;
  otherPGYearOfJoining: string;
  otherPGYearOfPassing: string;
  otherPGDesignation: string;
  
  hasExperience: boolean;
  experiences: Array<{
    designation: string;
    institution: string;
    place: string;
    fromDate: string;
    toDate: string;
  }>;
};

export const FacultyApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const methods = useForm<FormData>({
    defaultValues: {
      fullName: '',
      gender: '',
      dateOfBirth: '',
      age: '',
      email: '',
      phone: '',
      position: '',
      applicationType: '',
      profilePicture: null,
      profilePicturePreview: '',
      resume: null,
      
      btechCGPA: '',
      tenthSchoolName: '',
      tenthPlace: '',
      tenthTimeline: '',
      tenthPercentage: '',
      interCollegeName: '',
      interPlace: '',
      interTimeline: '',
      interPercentage: '',
      
      mtechYearOfJoining: '',
      mtechYearOfGraduation: '',
      mtechDesignation: '',
      otherPGDegree: '',
      otherPGYearOfJoining: '',
      otherPGYearOfPassing: '',
      otherPGDesignation: '',
      
      hasExperience: false,
      experiences: [{
        designation: '',
        institution: '',
        place: '',
        fromDate: '',
        toDate: ''
      }]
    }
  });

  const steps = [
    { name: 'Personal Information', component: PersonalInformation },
    { name: 'Education', component: Education },
    { name: 'Postgraduate Information', component: PostgraduateInformation },
    { name: 'Academic Experience', component: AcademicExperience },
    { name: 'Document Uploads', component: DocumentUploads },
    { name: 'Summary', component: FormSummary }
  ];

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    // Step 3: Academic Experience (4th page) - Send form data
    if (activeStep === 3 && !applicationId) {
      setIsSubmitting(true);

      try {
        const { profilePicture, resume, profilePicturePreview, ...formData } = methods.getValues();

        // Send all form fields except files to API
        const response = await axios.post('http:localhost:3000/faculty-application/data', formData);
        
        // Store application ID for document upload
        setApplicationId(response.data.id);
        alert('Application data saved successfully!');
        
        // Move to next step
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
      } catch (error) {
        console.error('Failed to submit application:', error);
        alert('Error submitting application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For all other steps, just move to next step
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
    
    window.scrollTo(0, 0);
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: FormData) => {
    // Step 4: Document Uploads (5th page) - Send media files
    if (activeStep === 4) {
      if (!applicationId) {
        alert('Please complete the Academic Experience step first.');
        return;
      }

      if (!data.profilePicture || !data.resume) {
        alert('Please upload both profile picture and resume before proceeding.');
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append('profilePicture', data.profilePicture);
        formData.append('resume', data.resume);
        formData.append('applicationId', applicationId);

        await axios.post('http:localhost:3000/faculty-application/media/:applicationId', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Documents uploaded successfully!');
        
        // Move to summary page
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error uploading documents:', error);
        alert('Failed to upload documents. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } 
    // Step 5: Summary (6th page) - Final submission
    else if (activeStep === 5) {
      if (!applicationId) {
        alert('Application not found. Please start over.');
        return;
      }

      setIsSubmitting(true);

      try {
        // Final submission confirmation
        await axios.patch(`/api/application/${applicationId}/submit`);
        
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error finalizing application:', error);
        alert('Failed to finalize application. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  const ActiveStepComponent = steps[activeStep].component;

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your application. We will review it and get back to you soon.
          </p>
          {applicationId && (
            <p className="text-sm text-gray-500">
              Application ID: {applicationId}
            </p>
          )}
        </div>
      </div>
    );
  }

  const handleFinalSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    if (!applicationId) {
      alert('Application not found. Please start over.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Final submission confirmation
      await axios.patch(`/api/application/${applicationId}/submit`);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error finalizing application:', error);
      alert('Failed to finalize application. Please try again.');
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">Faculty Application Form</h1>
          <ProgressBar steps={steps.map(s => s.name)} currentStep={activeStep} />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {steps[activeStep].name}
              </h2>
              
              <ActiveStepComponent />

              <div className="mt-8 flex justify-between items-center pt-6 border-t">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                
                <div className="ml-auto">
                  {activeStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};