import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button,
  Paper, Divider, Snackbar, Alert, CircularProgress, Grid
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { useNavigate } from "react-router-dom";

const SellerLoginPage = () => {

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {

    if (!/^[0-9]{10}$/.test(phone)) {
      return setSnack({ open: true, message: "Enter valid phone number", severity: "warning" });
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/seller/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setShowOtp(true);
      setTimer(30);

      setSnack({ open: true, message: "OTP Sent Successfully 📱", severity: "success" });

    } catch (err) {
      setSnack({ open: true, message: err.message || "Error", severity: "error" });
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {

    if (!/^[0-9]{4,6}$/.test(otp)) {
      return setSnack({ open: true, message: "Invalid OTP", severity: "warning" });
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:8080/api/seller/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
  
      const data = await res.json();
  
      if (!data.success) {
        throw new Error(data.message || "Login Failed");
      }
  
      // ✅ SAVE
      localStorage.setItem("seller", JSON.stringify(data.seller));
      localStorage.setItem("sellerPhone", phone);
  
      setSnack({ open: true, message: "Login Successful 🚀", severity: "success" });
      navigate("/seller/dashboard"); 
      // ✅ FIXED FLOW
     
    } catch (err) {
      setSnack({ open: true, message: err.message || "Login Failed", severity: "error" });
    }
  
    setLoading(false);
  };

  return (
    <Box sx={{
      bgcolor: "#f1f3f6",
      minHeight: "calc(100vh - 160px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <Grid container justifyContent="center">
        <Grid item xs={11} md={8} lg={6}>

          <Paper sx={{
            display: "flex",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            transition: "0.3s",
            ':hover': {
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)"
            }
          }}>

            {/* LEFT SIDE */}
            <Box sx={{
              width: "40%",
              background: "linear-gradient(135deg,#2874f0,#1a5ed8)",
              color: "white",
              p: 4,
              display: { xs: "none", md: "block" }
            }}>
              <Typography variant="h5" fontWeight="bold">
                Seller Login
              </Typography>

              <Typography sx={{ mt: 2, opacity: 0.9 }}>
                Access your dashboard, manage orders & grow your business.
              </Typography>

              <Box sx={{ mt: 4, lineHeight: 2 }}>
                <Typography>✔ Manage Orders</Typography>
                <Typography>✔ Track Earnings</Typography>
                <Typography>✔ Add Products</Typography>
                <Typography>✔ Grow Business</Typography>
              </Box>
            </Box>

            {/* RIGHT SIDE */}
            <Box sx={{ width: { xs: "100%", md: "60%" }, p: 4 }}>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PhoneAndroidIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Login with OTP
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={showOtp}
                sx={{ mb: 3 }}
              />

              {!showOtp ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={loading}
                  sx={{
                    bgcolor: "#fb641b",
                    ':hover': { bgcolor: "#e85a17" },
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: 2
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send OTP"}
                </Button>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    sx={{
                      bgcolor: "#fb641b",
                      ':hover': { bgcolor: "#e85a17" },
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify & Login"}
                  </Button>

                  <Button
                    fullWidth
                    disabled={timer > 0}
                    onClick={handleSendOtp}
                    sx={{ textTransform: "none" }}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </Button>
                </>
              )}

            </Box>
          </Paper>

        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default SellerLoginPage;
