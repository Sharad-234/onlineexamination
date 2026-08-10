/**
 * Success.jsx
 * 
 * Displayed after successful application submission.
 * Shows the application ID, payment status, and
 * provides buttons to download the PDF or view application details.
 */

import { Link, useParams } from 'react-router-dom';
import { getPDFDownloadURL } from '../api/api';

function Success() {
  const { id } = useParams();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="success-icon">✓</div>
        <h1 className="success-title">Application Submitted Successfully!</h1>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Application ID</div>
            <div className="info-value">{id}</div>
          </div>
        </div>

        <div className="success-actions">
          <a
            href={getPDFDownloadURL(id)}
            className="btn btn-success btn-lg"
            download
          >
            📄 Download Application PDF
          </a>
          <Link to={`/application/${id}`} className="btn btn-outline btn-lg">
            View Application
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;
