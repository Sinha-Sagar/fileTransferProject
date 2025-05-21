import React, { useEffect, useState } from "react";

const ListFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:8080/file/listFiles");  // <-- updated endpoint here
        if (!res.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Available Files</h2>

      {loading && <p>Loading files...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && files.length === 0 && <p>No files found.</p>}

      <ul>
        {files.map((file) => (
          <li key={file}>
            <a href={`http://localhost:8080/file/download?key=${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListFiles;
