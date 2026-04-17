import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../Api/axiosConfig";

// ✅ NEW ICONS
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LogoutIcon from "@mui/icons-material/Logout";

const MyProfile = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pan: ""
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser?.name || "",
        mobile: parsedUser?.mobile || "",
        email: parsedUser?.email || "",
        address: parsedUser?.address || "",
        pan: parsedUser?.pan || ""
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = "Full name is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      newErrors.email = "Invalid email format";
    if (!user.address.trim()) newErrors.address = "Address is required";
    if (!user.pan.trim()) newErrors.pan = "PAN is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(user.pan))
      newErrors.pan = "Invalid PAN format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const userId = Number(localStorage.getItem("userId"));
      const res = await api.post("/api/auth/update-profile", {
        userId,
        name: user.name,
        email: user.email,
        address: user.address,
        pan: user.pan
      });

      const updatedUser = {
        id: res.data.userId,
        name: res.data.name,
        mobile: res.data.mobile,
        email: res.data.email,
        address: res.data.address,
        pan: res.data.pan
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userId", updatedUser.id);
      window.dispatchEvent(new Event("userChanged"));
      setUser(updatedUser);
      setEdit(false);
      setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
    } catch (error) {
      console.error("Update Error:", error);
      setSnackbar({ open: true, message: "Profile update failed", severity: "error" });
    }
  };

  return (
    <Box sx={{ background: "#f1f3f6", minHeight: "100vh", py: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

            {/* HEADER */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                sx={{
                  background: "linear-gradient(135deg,#2874f0,#1b5fd1)",
                  width: 65,
                  height: 65,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography fontSize={14} color="text.secondary">
                  Hello,
                </Typography>
                <Typography fontWeight={600} fontSize={20}>
                  {user?.name || user?.mobile}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* PERSONAL INFO */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <PersonIcon /> Personal Information
              </Typography>
              {!edit && (
                <Button variant="outlined" size="small" onClick={() => setEdit(true)}>
                  Edit
                </Button>
              )}
            </Box>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user?.name}
                  disabled={!edit}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Mobile Number" value={user?.mobile} disabled />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled={!edit}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "#2874f0" }} />
                  }}
                />
              </Grid>
            </Grid>

            {/* ADDRESS */}
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
              <HomeIcon /> Delivery Address
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              disabled={!edit}
              value={user?.address}
              error={!!errors.address}
              helperText={errors.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />

            {/* PAN */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
              <CreditCardIcon /> PAN Card
            </Typography>

            <TextField
              fullWidth
              disabled={!edit}
              value={user?.pan}
              error={!!errors.pan}
              helperText={errors.pan}
              onChange={(e) =>
                setUser({ ...user, pan: e.target.value.toUpperCase() })
              }
            />

            {/* BUTTONS */}
            <Box mt={3} display="flex" gap={2}>
              {edit && (
                <Button variant="contained" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
              {edit && (
                <Button variant="outlined" onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              )}
              <Button color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            </Box>

            {/* ORDERS */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" mb={2}>
              My Orders
            </Typography>

            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No Orders Yet</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/")}
              >
                Start Shopping
              </Button>
            </Box>

          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyProfile;