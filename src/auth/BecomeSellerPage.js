import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, Button,
  Paper, MenuItem, Divider, Snackbar, Alert, CircularProgress
} from "@mui/material";

const BecomeSellerPage = () => {

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    businessName: "", gst: "", category: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const categories = [
    "Electronics","Fashion", "Home & Kitchen", "Beauty", "Books","Other"
  ];

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "gst") value = value.toUpperCase();
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  useEffect(() => {
    let temp = {};

    temp.name = form.name
      ? (form.name.length >= 3 ? "" : "Too short")
      : "Name required";

    temp.email = form.email
      ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Invalid email")
      : "Email required";

    temp.phone = form.phone
      ? (/^[0-9]{10}$/.test(form.phone) ? "" : "Invalid phone")
      : "Phone required";

    temp.businessName = form.businessName
      ? (form.businessName.length >= 3 ? "" : "Too short")
      : "Business name required";

    temp.gst = form.gst
      ? (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(form.gst) ? "" : "Invalid GST")
      : "GST required";

    temp.category = form.category ? "" : "Select category";

    setErrors(temp);

  }, [form]);

  const isValid = Object.values(errors).every(x => x === "");

  // ===================== SEND OTP FIXED =====================
  const sendOtp = async () => {

    setTouched({
      name: true,
      email: true,
      phone: true,
      businessName: true,
      gst: true,
      category: true
    });

    if (!isValid) {
      setSnack({
        open: true,
        message: "Fix all errors first ❌",
        severity: "warning"
      });
      return;
    }

    const cleanData = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()])
    );

    setLoading(true);

    try {
      const res = await fetch(
        "https://easybuy-backend-xadk.onrender.com/api/seller/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanData)
        }
      );

      const data = await res.json();

      if (!data?.success) {
        throw new Error(data?.message || "OTP Failed");
      }

      setShowOtp(true);
      setTimer(30);

      setSnack({
        open: true,
        message: "OTP Sent 📱",
        severity: "success"
      });

    } catch (err) {
      setSnack({
        open: true,
        message: err.message || "Error ❌",
        severity: "error"
      });
    }

    setLoading(false);
  };

  // ===================== VERIFY OTP FIXED =====================
  const handleVerifyOtp = async () => {

    if (!/^[0-9]{4,6}$/.test(otp)) {
      return setSnack({
        open: true,
        message: "Enter valid OTP",
        severity: "warning"
      });
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://easybuy-backend-xadk.onrender.com/api/seller/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            otp
          })
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      localStorage.setItem("seller", JSON.stringify(data.seller));
      localStorage.setItem("sellerPhone", data.seller.phone);

      window.dispatchEvent(new Event("sellerChanged"));

      setSnack({
        open: true,
        message: "Registered Successfully 🚀",
        severity: "success"
      });

      setTimeout(() => {
        window.location.href = "/seller/dashboard";
      }, 1000);

    } catch (err) {
      setSnack({
        open: true,
        message: err.message || "Invalid OTP ❌",
        severity: "error"
      });
    }

    setLoading(false);
  };

  return (
    <Box sx={{ bgcolor: "#f1f3f6", minHeight: "calc(100vh - 160px)", p: 3 }}>

      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Become a Seller 🛒
        </Typography>
      </Paper>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight="bold">Why Sell With Us?</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>

            <TextField fullWidth label="Full Name *" name="name"
              value={form.name} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField fullWidth label="Email *" name="email"
              value={form.email} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField fullWidth label="Phone *" name="phone"
              value={form.phone} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField fullWidth label="Business Name *" name="businessName"
              value={form.businessName} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField fullWidth label="GST *" name="gst"
              value={form.gst} onChange={handleChange} sx={{ mb: 2 }} />

            <TextField select fullWidth label="Category"
              name="category" value={form.category}
              onChange={handleChange} sx={{ mb: 2 }}>
              {categories.map((c, i) => (
                <MenuItem key={i} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            {!showOtp ? (
              <Button fullWidth variant="contained" onClick={sendOtp}>
                {loading ? <CircularProgress size={20} /> : "Register"}
              </Button>
            ) : (
              <>
                <TextField fullWidth label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mb: 2 }} />

                <Button fullWidth variant="contained" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              </>
            )}

          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default BecomeSellerPage;
