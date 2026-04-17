import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../Api/axiosConfig";
import AuthLayout from "./AuthLayout";

const RegisterForm = ({ switchToLogin = () => {} }) => {

  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showMsg = (msg, sev = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  // MOBILE VALIDATION
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

  // OTP VALIDATION
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
    setOtpVerified(false);

    if (mobileError) setMobileError("");
  };

  const handleSendOtp = async () => {

    if (!validateMobile()) return;

    setLoading(true);

    try {

      const res = await api.post(
        "/api/auth/send-otp",
        { mobile },
        { params: { isLogin: false } }
      );

      showMsg(res?.data?.message || "OTP Sent Successfully", "success");
      setOtpSent(true);

    } catch (error) {

      console.log(error.response);

      showMsg(
        error?.response?.data?.message || "Failed to send OTP",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {

    if (!validateOtp()) return;

    setLoading(true);

    try {

      const res = await api.post("/api/auth/verify-otp", {
        mobile: mobile,
        otp: otp
      });

      const userData = {
        id: res?.data?.userId,
        name: res?.data?.name || "",
        mobile: res?.data?.mobile || mobile
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", String(res?.data?.userId));

      window.dispatchEvent(new Event("userChanged"));

      showMsg("Registration Successful", "success");

      setOtpVerified(true);

      setTimeout(() => navigate("/"), 800);

    } catch (error) {

      showMsg(
        error?.response?.data?.message || "Invalid or Expired OTP",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  const flipkartButtonStyle = {
    mt: 2,
    height: 48,
    bgcolor: "#2874f0 !important",
    color: "#fff !important",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "none",
  };

  return (

<AuthLayout
title="Looks like you're new here!"
subtitle="Sign up with your mobile number to get started"
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
disabled={otpVerified}
/>

{!otpSent && (

<Button
fullWidth
variant="contained"
onClick={handleSendOtp}
disabled={loading || mobile.length !== 10}
sx={flipkartButtonStyle}
>

{loading
? <CircularProgress size={24} sx={{ color: "#ffc107" }} />
: "Request OTP"}

</Button>

)}

{otpSent && !otpVerified && (

<>

<TextField
fullWidth
label="Enter OTP"
margin="normal"
value={otp}
inputProps={{ maxLength: 6 }}
onChange={(e) => {

setOtp(e.target.value.replace(/\D/g, ""));

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
sx={flipkartButtonStyle}
>

{loading
? <CircularProgress size={24} sx={{ color: "#ffc107" }} />
: "Verify OTP"}

</Button>

</>

)}

<Typography mt={2} fontSize={14}>

Already have an account?{" "}

<span
style={{ color: "#2874f0", cursor: "pointer" }}
onClick={switchToLogin}
>

Login

</span>

</Typography>

<Snackbar
open={open}
autoHideDuration={3000}
onClose={() => setOpen(false)}
>

<Alert
severity={severity}
variant="filled"
onClose={() => setOpen(false)}
>

{message}

</Alert>

</Snackbar>

</AuthLayout>

  );
};

export default RegisterForm;