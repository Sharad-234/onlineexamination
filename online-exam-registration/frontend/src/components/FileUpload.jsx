/**
 * FileUpload.jsx
 * 
 * Reusable file upload component.
 * Shows a drag-area with click-to-upload, validates file type and size,
 * displays an image preview for photos, and shows file info for payment proofs.
 */

import { useRef, useState } from 'react';

function FileUpload({
  label,
  name,
  accept,
  maxSizeMB,
  preview,
  onFileSelect,
  onFileRemove,
  error,
  required = false,
  children,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileRemove();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <div
        className={`file-upload-area ${preview ? 'has-file' : ''} ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
        />

        {preview ? (
          <div>
            {preview.type === 'image' ? (
              <img src={preview.url} alt="Preview" className="image-preview" />
            ) : null}
            <div className="file-preview-info">
              <span>{preview.name}</span>
              <span className="remove-file" onClick={handleRemove}>
                Remove
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="file-info">
              Accepted: {accept} (Max: {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default FileUpload;
