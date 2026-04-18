import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, TextField, Button,
  Paper, Divider, Snackbar, Alert, CircularProgress
} from "@mui/material";

const SellerKycPage = () => {

  const [kyc, setKyc] = useState({
    pan: "",
    gst: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    holderName: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // 🔐 Session Check
  useEffect(() => {
    const phone = localStorage.getItem("sellerPhone");
    if (!phone) window.location.href = "/";
  }, []);

  // ✏️ Handle Input
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (["pan", "ifsc", "gst"].includes(name)) {
      value = value.toUpperCase();
    }

    setKyc(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // ✅ VALIDATION (STRICT)
  useEffect(() => {
    let temp = {};

    temp.pan = kyc.pan
      ? (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(kyc.pan) ? "" : "Invalid PAN")
      : "PAN is required";

    temp.gst = kyc.gst
      ? (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(kyc.gst) ? "" : "Invalid GST")
      : "GST is required";

    temp.accountNumber = kyc.accountNumber
      ? (/^[0-9]{9,18}$/.test(kyc.accountNumber) ? "" : "Invalid account number")
      : "Account number required";

    temp.confirmAccountNumber = kyc.confirmAccountNumber
      ? (kyc.accountNumber === kyc.confirmAccountNumber ? "" : "Account numbers do not match")
      : "Confirm account number required";

    temp.ifsc = kyc.ifsc
      ? (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(kyc.ifsc) ? "" : "Invalid IFSC")
      : "IFSC required";

    temp.holderName = kyc.holderName
      ? (/^[A-Za-z ]{3,}$/.test(kyc.holderName) ? "" : "Invalid name")
      : "Holder name required";

    temp.address = kyc.address
      ? (kyc.address.length >= 10 ? "" : "Address too short")
      : "Address required";

    setErrors(temp);

  }, [kyc]);

  const isValid = Object.values(errors).every(x => x === "");

  // 🚀 SUBMIT
  const handleSubmit = async () => {

    // 🔥 Force show all errors
    setTouched({
      pan: true,
      gst: true,
      accountNumber: true,
      confirmAccountNumber: true,
      ifsc: true,
      holderName: true,
      address: true
    });

    if (!isValid) {
      setSnack({
        open: true,
        message: "Fix all errors first ❌",
        severity: "warning"
      });
      return;
    }

    const phone = localStorage.getItem("sellerPhone");

    // 🔥 Clean Data
    const cleanData = Object.fromEntries(
      Object.entries(kyc).map(([k, v]) => [k, v.trim()])
    );

    setLoading(true);

    try {
      const res = await fetch("https://easybuy-backend-xadk.onrender.com/api/seller/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, ...cleanData })
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();

if (!data?.success) {
  throw new Error(data?.message || "KYC Failed");
}

// 🔥 ADD THIS BLOCK
if (data.bankVerified === false) {
  setSnack({
    open: true,
    message: "Bank verification pending ⏳",
    severity: "info"
  });
} else {
  setSnack({
    open: true,
    message: "KYC + Bank Verified ✅",
    severity: "success"
  });
}

      localStorage.setItem("kycDone", "true");

      
      setTimeout(() => {
        window.location.href = "/SellerDashboardPage";
      }, 1200);

    } catch (err) {
      setSnack({
        open: true,
        message: err.message || "Something went wrong ❌",
        severity: "error"
      });
    }

    setLoading(false);
  };

  return (
    <Box sx={{ bgcolor: "#f1f3f6", minHeight: "100vh", p: 3 }}>

      {/* HEADER */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Complete Your KYC 🔐
        </Typography>
        <Typography sx={{ mt: 1, color: "gray" }}>
          Verify your identity & bank details to start selling.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>

        {/* BUSINESS */}
        <Typography variant="h6" fontWeight="bold">
          Business Details
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="PAN Number *"
              name="pan"
              value={kyc.pan}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 10 }}
              error={touched.pan && !!errors.pan}
              helperText={touched.pan && errors.pan}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="GST Number *"
              name="gst"
              value={kyc.gst}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 15 }}
              error={touched.gst && !!errors.gst}
              helperText={touched.gst && errors.gst}
            />
          </Grid>

        </Grid>

        {/* BANK */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
          Bank Details
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Account Number *"
              name="accountNumber"
              value={kyc.accountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.accountNumber && !!errors.accountNumber}
              helperText={touched.accountNumber && errors.accountNumber}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Confirm Account Number *"
              name="confirmAccountNumber"
              value={kyc.confirmAccountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmAccountNumber && !!errors.confirmAccountNumber}
              helperText={touched.confirmAccountNumber && errors.confirmAccountNumber}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="IFSC Code *"
              name="ifsc"
              value={kyc.ifsc}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 11 }}
              error={touched.ifsc && !!errors.ifsc}
              helperText={touched.ifsc && errors.ifsc}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth label="Account Holder Name *"
              name="holderName"
              value={kyc.holderName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.holderName && !!errors.holderName}
              helperText={touched.holderName && errors.holderName}
            />
          </Grid>

        </Grid>

        {/* ADDRESS */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
          Pickup Address
        </Typography>
        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth multiline rows={3}
          label="Full Address *"
          name="address"
          value={kyc.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.address && !!errors.address}
          helperText={touched.address && errors.address}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 4, py: 1.5 }}
          onClick={handleSubmit}
          disabled={loading || !isValid}
        >
          {loading ? <CircularProgress size={24} /> : "Complete KYC"}
        </Button>

      </Paper>

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

export default SellerKycPage;
