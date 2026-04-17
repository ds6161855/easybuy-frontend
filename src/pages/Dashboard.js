import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ background: "#f1f3f6", minHeight: "100vh" }}>
    
          <Box sx={{ p: 3 }}>
        <Typography variant="h5">
          Welcome to Dashboard 🎉
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
};

export default Dashboard;