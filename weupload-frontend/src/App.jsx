import { useState } from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


import Upload from './pages/Upload';
import Download from './pages/Download';
import ListFiles from './pages/ListFiles';
import SendDownloadLink from './pages/SendDownloadLink';
import LoginWithGoogle from './pages/LoginWithGoogle';
import GoogleCallback from './pages/GoogleCallback';

// Replace this with your actual Google OAuth Client ID
const clientId = "988176419346-8jaqr6ij2lmf4bcj3ooh837akp28vr3b.apps.googleusercontent.com";

function App() {
  const [count, setCount] = useState(0);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginWithGoogle />} />
          <Route path="/google/callback" element={<GoogleCallback />} /> 
          <Route path="/upload" element={<Upload />} />
          <Route path="/listFiles" element={<ListFiles />} />
          <Route path="/download" element={<Download />} />
          <Route path="/SendDownloadLink" element={<SendDownloadLink />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
