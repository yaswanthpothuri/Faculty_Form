import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, UserIcon, Eye, Calendar, Mail, Phone, MapPin, GraduationCap, Briefcase, X, Filter, Check, Clock, ChevronDown, Loader2, User, Award, XCircle } from 'lucide-react';

const FacultyAdminDashboard = () => {
  
interface Application {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
  gender: string;
  applicationType: string;
  profilePictureKey?: string;
  phone?: string;
  age?: number;
  dateOfBirth?: Date | string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  tenthSchoolName?: string;
  tenthPlace?: string;
  tenthTimeline?: string;
  tenthPercentage?: string;
  interCollegeName?: string;
  interPlace?: string;
  interTimeline?: string;
  interPercentage?: string;
  ugCourse?: string;
  ugCollegeName?: string;
  ugBranch?: string;
  ugPlace?: string;
  ugTimeline?: string;
  ugCgpa?: string;
  mtechDesignation?: string;
  mtechYearOfJoining?: string;
  mtechYearOfGraduation?: string;
  mtechCollege?: string;
  mtechCgpa?: string;
  otherPGDegree?: string;
  otherpgcollege?: string;
  otherPGDesignation?: string;
  otherPGYearOfJoining?: string;
  otherPGYearOfPassing?: string;
  otherPGCgpa?: string;
  hasExperience?: boolean;
  experiences?: {
    id?: string;
    experiencetype?: string;
    designation?: string;
    institution?: string;
    place?: string;
    fromDate?: string;
    toDate?: string;
  }[];
  resumeKey?: string;
}

const [applications, setApplications] = useState<Application[]>([]);
const [selectedApplication, setSelectedApplication] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({
  status: 'all',
  position: 'all',
  gender: '',
  type: ''
});
const [showFilters, setShowFilters] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// useMemo for filtered applications
const filteredApplications = useMemo(() => {
  if (!applications.length) return [];
  
  return applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' ||
                         app.status.toLowerCase() === filters.status.toLowerCase();
    
    const matchesPosition = filters.position === 'all' ||
                           app.position.toLowerCase().includes(filters.position.toLowerCase());
    
    const matchesGender = !filters.gender || (app.gender?.toLowerCase() ?? '') === filters.gender.toLowerCase();
    const matchesType = !filters.type || (app.applicationType?.toLowerCase() ?? '') === filters.type.toLowerCase();
                           
    
    return matchesSearch && matchesStatus && matchesPosition && matchesGender && matchesType;
  });
}, [applications, searchTerm, filters]);

// Fetch applications from backend
useEffect(() => {
  fetchApplications();
}, []);

const fetchApplications = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('http://localhost:3000/userDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform data to match component expectations
    const transformedData = data.map(app => ({
      ...app,
      dateOfBirth: new Date(app.dateOfBirth),
      createdAt: new Date(app.createdAt),
      updatedAt: new Date(app.updatedAt),
      status: app.status || 'Pending', // Default to Pending if no status
      publicationsCount: app.experiences?.length || Math.floor(Math.random() * 20) + 5
    }));
    
    setApplications(transformedData);
  } catch (err) {
    console.error('Error fetching applications:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
  setFilters(prev => ({
    ...prev,
    [filterType]: value
  }));
};

const clearFilters = () => {
  setFilters({
    status: 'all',
    position: 'all',
    gender: '',
    type: ''
  });
  setSearchTerm('');
};

  const handleCardClick = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleDownloadResume = (resumeKey, applicantName) => {
    if (!resumeKey) {
      alert('Resume not available for download');
      return;
    }
    window.open(resumeKey, '_blank');
  };

  const handleStatusApplication = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/faculty-application/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update application status to ${newStatus}`);
      }

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(`Error updating application status to ${newStatus}:`, error);
      alert(`Failed to update application status to ${newStatus}. Please try again.`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <Check className="w-3 h-3 sm:w-3 sm:h-3" />,
          iconBg: 'bg-green-500'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
          iconBg: 'bg-red-500'
        };
      case 'pending':
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
          iconBg: 'bg-yellow-500'
        };
    }
  };
  const calculateExperience = (fromDateStr, toDateStr) => {
    if (!fromDateStr) return { years: 0, months: 0 };
    
    const fromDate = new Date(fromDateStr);
    const toDate = toDateStr ? new Date(toDateStr) : new Date(); // Use current date if no end date
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return { years: 0, months: 0 };
    }
    
    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };
  const formatExperience = (years, months) => {
    if (years === 0 && months === 0) return 'Less than a month';
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  };
  const calculateTotalExperience = (experiences) => {
    let totalMonths = 0;
    
    experiences.forEach(exp => {
      const { years, months } = calculateExperience(exp.fromDate, exp.toDate);
      totalMonths += (years * 12) + months;
    });
    
    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    
    return { years: totalYears, months: remainingMonths };
  };
  const ApplicationCard = ({ application }) => {
    const statusConfig = getStatusConfig(application.status);
    
    return (
      <div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
        onClick={() => handleCardClick(application)}
      >
        {/* Card Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end space-x-4">
            <img
              src={application.profilePictureKey || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={application.fullName}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
              }}
            />
            <div className="flex-1 text-white">
              <h3 className="font-bold text-base sm:text-lg truncate">{application.fullName}</h3>
              <p className="text-xs sm:text-sm opacity-90 truncate">{application.position}</p>
            </div>
            {application.status !== 'Pending' && (
              <div className={`text-white rounded-full p-1 sm:p-2 ${statusConfig.iconBg}`}>
                {statusConfig.icon}
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-indigo-600 truncate">{application.applicationType}</span>
            <div className="flex items-center space-x-2">
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex items-center space-x-1`}>
      <span className={`w-2 h-2 rounded-full ${statusConfig.iconBg}`}></span>
      <span>{application.status || 'Pending'}</span>
    </span>
  </div>
          </div>

          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{application.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{application.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{application.age} years old</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>{application.gender}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Applied: {formatDate(application.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ApplicationModal = ({ application, isOpen, onClose }) => {
    if (!isOpen || !application) return null;

    const statusConfig = getStatusConfig(application.status);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {application.fullName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={application.profilePictureKey || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={application.fullName}
                className="w-24 h-24 rounded-full border-4 border-indigo-600 shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{application.position}</h3>
                <p className="text-gray-600 mb-2">{application.applicationType}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    {application.status || 'Pending'}
                  </span>
                  <span className="text-sm text-gray-500">Age: {application.age}</span>
                  <div className="flex items-center space-x-2">
              <UserIcon className="text-sm text-gray-500 h-4 w-4" />
              <span className="text-sm text-gray-500">{application.gender}</span>
            </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{application.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{application.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">DOB: {formatDate(application.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Applied: {formatDate(application.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="mr-2 text-indigo-600" size={24} />
                Education
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* 10th Grade */}
                <div className="bg-white/50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">10th Grade</h5>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">School:</span> {application.tenthSchoolName || 'N/A'}</div>
                    <div><span className="font-medium">Place:</span> {application.tenthPlace || 'N/A'}</div>
                    <div><span className="font-medium">Timeline:</span> {application.tenthTimeline || 'N/A'}</div>
                    <div><span className="font-medium">Percentage:</span> {application.tenthPercentage || 'N/A'}</div>
                  </div>
                </div>
                
                {/* 12th Grade */}
                <div className="bg-white/50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">12th Grade/Intermediate</h5>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">College:</span> {application.interCollegeName || 'N/A'}</div>
                    <div><span className="font-medium">Place:</span> {application.interPlace || 'N/A'}</div>
                    <div><span className="font-medium">Timeline:</span> {application.interTimeline || 'N/A'}</div>
                    <div><span className="font-medium">Percentage:</span> {application.interPercentage || 'N/A'}</div>
                  </div>
                </div>
                
                {/* B.Tech */}
                <div className="bg-white/50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">{application.ugCourse}</h5>
                  <div className="text-sm">
                    <div><span className="font-medium">College / University:</span> {application.ugCollegeName || 'N/A'}</div>
                  </div>
                  <div className="text-sm">
                    <div><span className="font-medium">Branch:</span> {application.ugBranch || 'N/A'}</div>
                  </div>
                  <div className="text-sm">
                    <div><span className="font-medium">Place:</span> {application.ugPlace || 'N/A'}</div>
                  </div>
                  <div className="text-sm">
                    <div><span className="font-medium">Timeline:</span> {application.ugTimeline || 'N/A'}</div>
                  </div>
                  <div className="text-sm">
                    <div><span className="font-medium">CGPA:</span> {application.ugCgpa || 'N/A'}</div>
                  </div>
                </div>
                
                {/* M.Tech */}
                {(application.mtechDesignation || application.mtechYearOfJoining || application.mtechYearOfGraduation || application.mtechCollege || application.mtechCgpa) && (
  <div className="bg-white/50 rounded-lg p-4">
    <h5 className="font-medium text-gray-900 mb-2">M.Tech</h5>
    <div className="text-sm space-y-1">
      <div><span className="font-medium">College:</span> {application.mtechCollege || 'N/A'}</div>
      <div><span className="font-medium">Designation:</span> {application.mtechDesignation || 'N/A'}</div>
      <div><span className="font-medium">Joining:</span> {application.mtechYearOfJoining || 'N/A'}</div>
      <div><span className="font-medium">Graduation:</span> {application.mtechYearOfGraduation || 'N/A'}</div>
      <div><span className="font-medium">CGPA:</span> {application.mtechCgpa || 'N/A'}</div>
    </div>
  </div>
)}

{/* Other PG */}
{(application.otherPGDegree || application.otherpgcollege || application.otherPGDesignation || application.otherPGYearOfJoining || application.otherPGYearOfPassing || application.otherPGCgpa) && (
  <div className="bg-white/50 rounded-lg p-4 md:col-span-2">
    <h5 className="font-medium text-gray-900 mb-2">Other Postgraduate {application.otherPGDegree && `(${application.otherPGDegree})`}</h5>
    <div className="text-sm space-y-1">
      <div><span className="font-medium">College:</span> {application.otherpgcollege || 'N/A'}</div>
      <div><span className="font-medium">Degree:</span> {application.otherPGDegree || 'N/A'}</div>
      <div><span className="font-medium">Designation:</span> {application.otherPGDesignation || 'N/A'}</div>
      <div><span className="font-medium">Joining:</span> {application.otherPGYearOfJoining || 'N/A'}</div>
      <div><span className="font-medium">Passing:</span> {application.otherPGYearOfPassing || 'N/A'}</div>
      <div><span className="font-medium">CGPA:</span> {application.otherPGCgpa || 'N/A'}</div>
    </div>
  </div>
)}  
              </div>
            </div>

            {/* Experience Section */}
            {application.hasExperience && application.experiences && application.experiences.length > 0 && (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold text-gray-900 flex items-center">
          <Briefcase className="mr-2 text-blue-600" size={24} />
          Experience
        </h4>
        <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
          <Clock className="mr-1 text-blue-600" size={16} />
          <span className="text-sm font-medium text-blue-800">
          Total: {(() => {
            const totalExp = calculateTotalExperience(application.experiences);
            return formatExperience(totalExp.years, totalExp.months);
          })()}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {application.experiences.map((exp, index) => {
          const expDuration = calculateExperience(exp.fromDate, exp.toDate);
          
          return (
            <div key={exp.id || index} className="bg-white/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    Experience {index + 1} - {exp.experiencetype}
                  </h5>
                  <h5 className="font-medium text-gray-900">{exp.designation || 'N/A'}</h5>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {formatExperience(expDuration.years, expDuration.months)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Institution:</span> {exp.institution || 'N/A'}</div>
                <div><span className="font-medium">Place:</span> {exp.place || 'N/A'}</div>
                <div><span className="font-medium">From:</span> {exp.fromDate || 'N/A'}</div>
                <div><span className="font-medium">To:</span> {exp.toDate || 'N/A'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadResume(application.resumeKey, application.fullName)}
                  className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 w-full sm:w-auto"
                  disabled={!application.resumeKey}
                >
                  <Download className="mr-2" size={16} />
                  View Resume
                </button>
                {application.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleStatusApplication(application.id, "Accepted")}
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <Check className="mr-2" size={16} />
                      Accept Application
                    </button>
                    <button
                      onClick={() => handleStatusApplication(application.id, "Rejected")}
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <XCircle className="mr-2" size={16} />
                      Reject Application
                    </button>
                  </>
                )}
                {application.status === "Accepted" && (
                  <div className="flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                    <Check className="mr-2" size={16} />
                    Application Accepted
                  </div>
                )}
                {application.status === "Rejected" && (
                  <div className="flex items-center px-6 py-3 bg-red-100 text-red-800 rounded-lg">
                    <XCircle className="mr-2" size={16} />
                    Application Rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-16 py-4 gap-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Faculty Applications
                </h1>
                <p className="text-sm text-gray-600">Manage and review faculty applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : (
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredApplications.length} Applications
                </div>
              )}
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 w-full md:w-auto"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Position Filter */}
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
  <select
    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    value={filters.position}
    onChange={(e) => handleFilterChange('position', e.target.value)}
  >
    <option value="all">All Positions</option>
    <option value="assistant_professor">Assistant Professor</option>
    <option value="associate_professor">Associate Professor</option>
    <option value="professor">Professor</option>
    <option value="head_of_department">Head of Department</option>
    <option value="dean">Dean</option>
    <option value="research_faculty">Research Faculty</option>
    <option value="visiting_faculty">Visiting Faculty</option>
  </select>
</div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="teaching">Teaching</option>
                    <option value="non_teaching">Non-Teaching</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={fetchApplications}
                className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700 text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-6">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-blue-700">Fetching applications...</p>
          </div>
        )}

        {/* Applications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No applications found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
      />
    </div>
  );
};

export default FacultyAdminDashboard;