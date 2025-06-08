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
import Loader from './ui/SubmitAnimation';

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

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: FormData) => {
    if (activeStep === 5) {
      if (!data.profilePicture || !data.resume) {
        alert('Please upload both profile picture and resume before proceeding.');
        return;
      }

      setIsSubmitting(true);

      try {
        const { profilePicture, resume, profilePicturePreview, experiences, ...textFields } = methods.getValues();
const formData = new FormData();

// Append all text fields
Object.entries(textFields).forEach(([key, value]) => {
  formData.append(key, value as any);
});

formData.append('profilePicture', profilePicture);
formData.append('resume', resume);
// ✅ Ensure experiences is stringified
formData.append('experiences', JSON.stringify(experiences));

// Append files

await axios.post('http://localhost:3000/faculty-application/full-submit', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

alert('Application submitted successfully!');
setIsSubmitted(true);
setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
window.scrollTo(0, 0);

      } catch (error) {
        console.error('Submission failed:', error);
        alert('Error submitting application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const ActiveStepComponent = steps[activeStep].component;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-100 px-4">
  <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-200">
    <div className="flex items-center justify-center bg-green-100 rounded-full w-20 h-20 mx-auto mb-6">
      <CheckCircle className="h-12 w-12 text-green-600" />
    </div>
    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
      Submission Successful!
    </h2>
    <p className="text-gray-600 text-md mb-6">
      Thank you for your application. Our team will review it and contact you shortly.
    </p>
  </div>
</div>

    );
  }

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
                  {activeStep === 5 ? (
                    // <button
                    //   type="button"
                    //   onClick={methods.handleSubmit(onSubmit)}
                    //   disabled={isSubmitting}
                    //   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    // >
                    //   {isSubmitting ? (
                    //     <>
                    //       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    //       Submitting...
                    //     </>
                    //   ) : (
                    //     'Submit Application'
                    //   )}
                    // </button>
                    <>
  {/* Submit Button */}
  <button
    type="button"
    onClick={methods.handleSubmit(onSubmit)}
    disabled={isSubmitting}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Submit Application
  </button>

  {/* Full-screen Loader */}
  {isSubmitting && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader />
      </div>
    </div>
  )}
</>
                  ) : (
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
