/**
 * Register.jsx
 * 
 * The main examination registration form page.
 * Fetches available exams from the backend API on mount.
 * Collects personal info, academic info, exam selection,
 * payment details, and file uploads.
 * Validates all fields client-side before submitting
 * multipart/form-data to the backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExams, submitApplication } from '../api/api';
import FileUpload from '../components/FileUpload';

// Initial empty form state
const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  course: '',
  college: '',
  examId: '',
};

// Available courses for the dropdown
const COURSES = [
  'BSc CSIT',
  'BIT',
  'BIM',
  'BBA',
  'BCA',
  'MSc CSIT',
  'MBA',
  'Other',
];

// Fallback exams if backend returns none (helps dev and local setups)
const DEFAULT_EXAMS = [
  { _id: 'exam-bsccsit', name: 'BSc CSIT Entrance Examination', fee: 1000 },
  { _id: 'exam-bit', name: 'BIT Entrance Examination', fee: 1000 },
  { _id: 'exam-bim', name: 'BIM Entrance Examination', fee: 800 },
  { _id: 'exam-bba', name: 'BBA Entrance Examination', fee: 800 },
  { _id: 'exam-msc', name: 'MSc CSIT Entrance Examination', fee: 1500 },
];


function Register() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // File state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  

  // Exam list state
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  // Selected exam fee
  const selectedExam = exams.find((e) => String(e._id) === String(form.examId));

  // Fetch exams on mount
  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams();
        if (Array.isArray(data) && data.length > 0) {
          setExams(data);
          // default to first exam if user hasn't chosen one
          setForm((prev) => ({ ...prev, examId: prev.examId || String(data[0]._id) }));
        } else {
          setExams(DEFAULT_EXAMS);
          setForm((prev) => ({ ...prev, examId: prev.examId || DEFAULT_EXAMS[0]._id }));
          setServerError('No exams found on server — using local fallback list');
        }
      } catch (err) {
        setServerError('Failed to load examinations. Please try again later.');
      } finally {
        setLoadingExams(false);
      }
    };
    loadExams();
  }, []);

  // Handle text/select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle photo file selection
  const handlePhotoSelect = useCallback((file) => {
    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Only JPG, JPEG, and PNG files are allowed',
      }));
      return;
    }
    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Photo must be smaller than 2MB',
      }));
      return;
    }
    setPhotoFile(file);
    setErrors((prev) => ({ ...prev, photo: '' }));
    // Create image preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview({ url: e.target.result, name: file.name, type: 'image' });
    };
    reader.readAsDataURL(file);
  }, []);

  // Remove photo
  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    } else if (form.fullName.trim().length > 100) {
      newErrors.fullName = 'Full name cannot exceed 100 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^9\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number starting with 9';
    }

    if (!form.course.trim()) {
      newErrors.course = 'Course / Program is required';
    }

    if (!form.college.trim()) {
      newErrors.college = 'College / School is required';
    }

    if (!form.examId) {
      newErrors.examId = 'Please select an examination';
    }


    if (!photoFile) {
      newErrors.photo = 'Photo is required';
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Build FormData for multipart/form-data
      const formData = new FormData();
      formData.append('fullName', form.fullName.trim());
      formData.append('email', form.email.trim());
      formData.append('phone', form.phone.trim());
      formData.append('course', form.course.trim());
      formData.append('college', form.college.trim());
      formData.append('examId', form.examId);
      formData.append('photo', photoFile);

      const response = await submitApplication(formData);

      // Redirect to success page
      navigate(`/success/${response.application.applicationId}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExams) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading examinations...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Examination Registration</h1>
      <p className="page-subtitle">
        Fill in all the required fields to complete your registration
      </p>

      {serverError && (
        <div className="alert alert-danger">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* ============ PERSONAL INFORMATION ============ */}
        <div className="card">
          <h2 className="section-title">Personal Information</h2>

          <FileUpload
            label="Upload Photo"
            name="photo"
            accept=".jpg,.jpeg,.png"
            maxSizeMB={2}
            preview={photoPreview}
            onFileSelect={handlePhotoSelect}
            onFileRemove={handlePhotoRemove}
            error={errors.photo}
            required
          />

          <div className="form-group">
            <label>Full Name <span className="required">*</span></label>
            <input
              type="text"
              name="fullName"
              className={`form-control ${errors.fullName ? 'error' : ''}`}
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="phone"
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="9800000000"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* ============ ACADEMIC INFORMATION ============ */}
        <div className="card">
          <h2 className="section-title">Academic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Course / Program <span className="required">*</span></label>
              <select
                name="course"
                className={`form-control ${errors.course ? 'error' : ''}`}
                value={form.course}
                onChange={handleChange}
              >
                <option value="">-- Select Course --</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.course && <p className="error-text">{errors.course}</p>}
            </div>

            <div className="form-group">
              <label>College / School <span className="required">*</span></label>
              <input
                type="text"
                name="college"
                className={`form-control ${errors.college ? 'error' : ''}`}
                placeholder="Enter your college name"
                value={form.college}
                onChange={handleChange}
              />
              {errors.college && <p className="error-text">{errors.college}</p>}
            </div>
          </div>
        </div>

        {/* ============ EXAMINATION ============ */}
        <div className="card">
          <h2 className="section-title">Examination</h2>

          <div className="form-group">
            <label>Select Examination <span className="required">*</span></label>
            <select
              name="examId"
              className={`form-control ${errors.examId ? 'error' : ''}`}
              value={form.examId}
              onChange={handleChange}
            >
              <option value="">-- Select Examination --</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.name} — NPR {typeof exam.fee === 'number' ? exam.fee.toLocaleString() : '0'}
                </option>
              ))}
              <option value="other">Other (contact administration)</option>
            </select>
            {errors.examId && <p className="error-text">{errors.examId}</p>}
          </div>
        </div>

        

        {/* ============ SUBMIT ============ */}
        <div className="card" style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
