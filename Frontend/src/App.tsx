import React from 'react';
import { FacultyApplicationForm } from './components/FacultyApplicationForm';
import FacultyAdminDashboard from './components/dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Vignan University Faculty Application Form
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete the form below to apply for a faculty position
          </p>
        </header>
        <FacultyApplicationForm />
      </div>
        <FacultyAdminDashboard />
    </div>
  );
}

export default App;