import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <Box
      sx={{
        minHeight: "78vh",
        background: "#f1f3f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        sx={{
          width: "90%",
          maxWidth: "1100px",
          minHeight: "600px",
          background: "#fff",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >

        {/* LEFT PANEL */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            background: "linear-gradient(135deg, #2874f0, #1c5fd4)",
            color: "#fff",
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1">{subtitle}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Box
              component="img"
              src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/343961744/original/2cc6fe35038febaf96b9046fe3c2e85c86d1a2b7/design-a-custom-modern-and-minimalist-simple-outstanding-logo-for-app-or-website.jpg"
              alt="auth"
              sx={{
                width: "80%",
                maxWidth: 250,
                borderRadius: 3,
                background: "#fff",
                padding: 2,
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
              }}
            />
          </Box>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            background: "#f9f9f9",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 350,
            }}
          >
            {children}
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AuthLayout;