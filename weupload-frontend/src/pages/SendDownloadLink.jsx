// src/pages/SendDownloadLink.jsx
import React, { useState } from "react";
import "./SendDownloadLink.css";

const SendDownloadLink = () => {
  const [toEmail, setToEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [linkValidity, setLinkValidity] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!toEmail || !downloadLink || !linkValidity) {
      alert("Please fill in the required fields: To email, Download Link, and Link Validity.");
      return;
    }

    const payload = {
      to: toEmail,
      bcc: bccEmail,
      cc: ccEmail,
      downloadLink,
      linkValidity,
    };

    try {
      setSending(true);
      setMessage("");

      const res = await fetch("http://localhost:8080/file/sendDownloadLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Email sent successfully!");
      } else {
        setMessage(data.error || "Failed to send email.");
      }
    } catch (error) {
      setMessage("Error sending email: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-email-container">
      <h2>Send Download Link via Email</h2>
      <form onSubmit={handleSendEmail} className="send-email-form">
        <label>
          To (required):
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
            placeholder="recipient@example.com"
          />
        </label>

        <label>
          BCC (optional):
          <input
            type="email"
            value={bccEmail}
            onChange={(e) => setBccEmail(e.target.value)}
            placeholder="bcc@example.com"
          />
        </label>

        <label>
          CC (optional):
          <input
            type="email"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            placeholder="cc@example.com"
          />
        </label>

        <label>
          Download Link (required):
          <input
            type="url"
            value={downloadLink}
            onChange={(e) => setDownloadLink(e.target.value)}
            required
            placeholder="http://example.com/download?key=abc123"
          />
        </label>

        <label>
          Link Validity (required):
          <input
            type="text"
            value={linkValidity}
            onChange={(e) => setLinkValidity(e.target.value)}
            required
            placeholder="2 minutes"
          />
        </label>

        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send Email"}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default SendDownloadLink;
