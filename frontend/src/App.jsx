import React from "react";
import AppRoutes from "./utils/Routes.jsx";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_CLIENT_KEY}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <AppRoutes />
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
