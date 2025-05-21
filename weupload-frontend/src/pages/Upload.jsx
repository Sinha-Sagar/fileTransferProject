import React, { useState, useRef, useEffect } from "react";
import "./Upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [expiryTime, setExpiryTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (expiryTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
        setCountdown(diff);
        if (diff <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryTime]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setShareLink("");
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setShareLink("");
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      const res = await fetch("http://localhost:8080/file/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.URL) {
        setShareLink(data.URL);
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 2); // As backend expires in 2 mins
        setExpiryTime(expiry);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File</h2>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop file here or click to select</p>}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {uploading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <button onClick={handleUpload} className="upload-btn" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {shareLink && (
        <div className="link-box">
          <p>Shareable Link (valid for 2 minutes):</p>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
          {countdown > 0 && <p>Expires in: {countdown}s</p>}
        </div>
      )}
    </div>
  );
};

export default Upload;
