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

  // ⏱ TIMER
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ✏️ INPUT
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "gst") value = value.toUpperCase();

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // 🔥 VALIDATION (STRICT)
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

  // 📲 SEND OTP
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
      const res = await fetch("http://localhost:8080/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData)
      });

      if (!res.ok) throw new Error("Server Error");

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

  // 🔐 VERIFY OTP
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
      const res = await fetch("http://localhost:8080/api/seller/verify",  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          otp: otp
        })
      });
  
      const data = await res.json();
  
      if (!data.success) {
        throw new Error(data.message || "Invalid OTP");
      }
  
      // 🔥 IMPORTANT — navbar ke liye
      localStorage.setItem("seller", JSON.stringify(data.seller));
  
      // optional
      localStorage.setItem("sellerPhone", data.seller.phone);
  
      // 🔥 navbar update
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
    <Box sx={{ bgcolor: "#f1f3f6",  minHeight: "calc(100vh - 160px)", p: 3 }}>

      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Become a Seller 🛒
        </Typography>
        <Typography sx={{ mt: 1, color: "gray" }}>
          Start your business with us and reach millions of customers.
        </Typography>
      </Paper>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Why Sell With Us?
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>✔ Huge customer base</Typography>
            <Typography>✔ Easy listing</Typography>
            <Typography>✔ Secure payments</Typography>
            <Typography>✔ Fast delivery</Typography>
            <Typography>✔ 24x7 support</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>

            <Typography variant="h6" fontWeight="bold">
              Register as Seller
            </Typography>

            <Divider sx={{ my: 2 }} />

            <TextField fullWidth label="Full Name *" name="name"
              value={form.name} onChange={handleChange} onBlur={handleBlur}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name} sx={{ mb: 2 }} />

            <TextField fullWidth label="Email *" name="email"
              value={form.email} onChange={handleChange} onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email} sx={{ mb: 2 }} />

            <TextField fullWidth label="Phone Number *" name="phone"
              value={form.phone} onChange={handleChange} onBlur={handleBlur}
              disabled={showOtp}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone} sx={{ mb: 2 }} />

            <TextField fullWidth label="Business Name *" name="businessName"
              value={form.businessName} onChange={handleChange} onBlur={handleBlur}
              error={touched.businessName && !!errors.businessName}
              helperText={touched.businessName && errors.businessName} sx={{ mb: 2 }} />

            <TextField fullWidth label="GST Number *" name="gst"
              value={form.gst} onChange={handleChange} onBlur={handleBlur}
              error={touched.gst && !!errors.gst}
              helperText={touched.gst && errors.gst} sx={{ mb: 2 }} />

            <TextField select fullWidth label="Product Category *"
              name="category" value={form.category}
              onChange={handleChange} onBlur={handleBlur}
              error={touched.category && !!errors.category}
              helperText={touched.category && errors.category}
              sx={{ mb: 2 }}
            >
              {categories.map((cat, i) => (
                <MenuItem key={i} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            {!showOtp ? (
              <Button fullWidth variant="contained"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Register Now"}
              </Button>
            ) : (
              <>
                <TextField fullWidth label="Enter OTP *"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  sx={{ mb: 2 }}
                />

                <Button fullWidth variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  sx={{ mb: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>

                <Button fullWidth disabled={timer > 0} onClick={sendOtp}>
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </Button>
              </>
            )}

          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default BecomeSellerPage;