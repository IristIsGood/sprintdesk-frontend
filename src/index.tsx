import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <GoogleOAuthProvider clientId="839069606081-nv1fh799s3ope6aa4pchq3m8j940u8o1.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);