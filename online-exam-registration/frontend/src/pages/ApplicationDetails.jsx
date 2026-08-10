/**
 * ApplicationDetails.jsx
 * 
 * Displays full application details for a given application ID.
 * Fetches data from the backend API.
 * Shows all submitted fields, status badges, and a PDF download button.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplication, getPDFDownloadURL } from '../api/api';

function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await getApplication(id);
        setApplication(data.application);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load application details.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert alert-danger">{error}</div>
          <Link to="/register" className="btn btn-primary">
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <h1 className="page-title">Application Details</h1>
      <p className="page-subtitle">Application ID: {application.applicationId}</p>

      <div className="card">
        {/* Status Overview */}
        <div className="info-grid" style={{ marginBottom: '24px' }}>
          <div className="info-item">
            <div className="info-label">Application Status</div>
            <div className="info-value">
              <span className={`status-badge ${application.applicationStatus}`}>
                {application.applicationStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
          </div>
          
        </div>

        {/* Personal Information */}
        <h2 className="section-title">Personal Information</h2>
        <div className="detail-row">
          <span className="detail-label">Full Name</span>
          <span className="detail-value">{application.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{application.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone</span>
          <span className="detail-value">{application.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Photo</span>
          <span className="detail-value">{application.hasPhoto ? 'Uploaded' : 'Not available'}</span>
        </div>

        {/* Academic Information */}
        <h2 className="section-title" style={{ marginTop: '24px' }}>Academic Information</h2>
        <div className="detail-row">
          <span className="detail-label">Course / Program</span>
          <span className="detail-value">{application.course}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">College / School</span>
          <span className="detail-value">{application.college}</span>
        </div>

        {/* Examination Details */}
        <h2 className="section-title" style={{ marginTop: '24px' }}>Examination Details</h2>
        <div className="detail-row">
          <span className="detail-label">Examination</span>
          <span className="detail-value">{application.examName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Examination Fee</span>
          <span className="detail-value">NPR {application.examFee?.toLocaleString()}</span>
        </div>

        

        {/* Submission Info */}
        <h2 className="section-title" style={{ marginTop: '24px' }}>Submission</h2>
        <div className="detail-row">
          <span className="detail-label">Submitted At</span>
          <span className="detail-value">{formatDate(application.submittedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="card" style={{ textAlign: 'center' }}>
        <a
          href={getPDFDownloadURL(application.applicationId)}
          className="btn btn-success btn-lg"
          download
        >
          📄 Download Application PDF
        </a>
      </div>
    </div>
  );
}

export default ApplicationDetails;
