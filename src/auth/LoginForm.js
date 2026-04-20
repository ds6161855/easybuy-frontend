import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Api/axiosConfig";
import AuthLayout from "./AuthLayout";
import { createClient } from "@supabase/supabase-js";



const LoginForm = ({ switchToRegister = () => {}, onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

  const showMsg = (msg, sev = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  // ================= TIMER =================
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ================= VALIDATIONS =================
  const validateMobile = () => {
    if (!mobile) {
      setMobileError("Mobile number required");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter valid 10 digit mobile number");
      return false;
    }
    setMobileError("");
    return true;
  };

  const validateOtp = () => {
    if (!otp) {
      setOtpError("OTP required");
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter valid 6 digit OTP");
      return false;
    }
    setOtpError("");
    return true;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    setOtp("");
    setOtpSent(false);
    if (mobileError) setMobileError("");
  };

  // ================= SEND OTP =================
const handleSendOtp = async () => {
  if (!validateMobile()) return;
  setLoading(true);

  try {
    const email = "dsmewada61@gmail.com";

    const { error } = await supabase.auth.signInWithOtp({
      email: email
    });

    if (error) throw error;

    showMsg("OTP sent to your email", "success");
    setOtpSent(true);
    setTimer(30);

  } catch (err) {
    showMsg(err.message || "Failed to send OTP", "error");
  } finally {
    setLoading(false);
  }
};

  const mergeCartAfterLogin = async () => {
    const userId = localStorage.getItem("userId");
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    for (let item of localCart) {
      await fetch("https://easybuy-backend-85si.onrender.com/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: item.productId,
          quantity: item.quantity
        })
      });
    }
  
    localStorage.removeItem("cart"); // clear guest cart
  };

  // ================= VERIFY OTP =================
  // ONLY change inside handleVerifyOtp

const handleVerifyOtp = async () => {
  if (!validateOtp()) return;
  setLoading(true);

  try {
    const email = "dsmewada61@gmail.com";

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email"
    });

    if (error) throw error;

    const user = data.user;

    const userData = {
      id: user.id,
      email: user.email
    };

    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isLoggedIn", "true");

    showMsg("Login successful", "success");

    navigate("/");
    onSuccess();

  } catch (err) {
    showMsg(err.message || "Invalid OTP", "error");
  } finally {
    setLoading(false);
  }
};
  const buttonStyle = {
    mt: 2,
    height: 48,
    bgcolor: "#2874f0 !important",
    color: "#fff !important",
    fontWeight: 600,
    textTransform: "none"
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Get access to your Orders, Wishlist and Recommendations"
    >
      <TextField
        fullWidth
        label="Enter Mobile Number"
        margin="normal"
        value={mobile}
        inputProps={{ maxLength: 10 }}
        onChange={handleMobileChange}
        error={Boolean(mobileError)}
        helperText={mobileError}
      />

      {!otpSent ? (
        <Button
          fullWidth
          variant="contained"
          onClick={handleSendOtp}
          disabled={loading || mobile.length !== 10}
          sx={buttonStyle}
        >
          {loading ? <CircularProgress size={24} /> : "Request OTP"}
        </Button>
      ) : (
        <>
          <TextField
            fullWidth
            label="Enter OTP"
            margin="normal"
            value={otp}
            inputProps={{ maxLength: 6 }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setOtp(value);
              if (otpError) setOtpError("");
            }}
            error={Boolean(otpError)}
            helperText={otpError}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            sx={buttonStyle}
          >
            {loading ? <CircularProgress size={24} /> : "Verify OTP"}
          </Button>

          {timer > 0 ? (
            <Typography mt={2} fontSize={13} color="text.secondary">
              Resend OTP in {timer}s
            </Typography>
          ) : (
            <Typography
              mt={2}
              fontSize={13}
              sx={{ cursor: "pointer", color: "#2874f0" }}
              onClick={handleSendOtp}
            >
              Resend OTP
            </Typography>
          )}
        </>
      )}

      <Typography mt={2} fontSize={14}>
        New to EasyBuy?{" "}
        <span
          style={{
            color: "#2874f0",
            cursor: "pointer",
            fontWeight: 600
          }}
          onClick={switchToRegister}
        >
          Create an account
        </span>
      </Typography>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
};

export default LoginForm;
