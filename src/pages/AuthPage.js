import React, { useState } from "react";
import { Box } from "@mui/material";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthPage = () => {

  const [showLogin, setShowLogin] = useState(true);
  console.log("showLogin:", showLogin);
  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "80vh",
          background: "#f1f3f6",
          pt: 2,
          display: "flex",
          justifyContent: "center"
        }}
      >

        {showLogin ? (
          <LoginForm switchToRegister={switchToRegister} />
        ) : (
          <RegisterForm switchToLogin={switchToLogin} />
        )}

      </Box>

      <Footer />
    </>
  );
};

export default AuthPage;