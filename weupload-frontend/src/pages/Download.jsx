import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Download = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) {
      setError("No file key provided in URL");
      setLoading(false);
      return;
    }

    const downloadFile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/file/download?key=${encodeURIComponent(key)}`, {
          method: "GET",
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.message || "Download failed");
          setLoading(false);
          return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        // Try to get filename from Content-Disposition header
        const disposition = res.headers.get("Content-Disposition");
        let filename = key;
        if (disposition && disposition.includes("filename=")) {
          filename = disposition
            .split("filename=")[1]
            .split(";")[0]
            .replace(/"/g, "");
        }

        // Create a link and click it to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
        setLoading(false);
      } catch (err) {
        console.error("Download error:", err);
        setError("Download error");
        setLoading(false);
      }
    };

    downloadFile();
  }, [searchParams]);

  if (loading) return <div>Downloading file...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return <div>Download complete.</div>;
};

export default Download;
