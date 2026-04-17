import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";

const PageLayout = ({ title, children }) => {
  return (
    <Box sx={{ bgcolor: "#f1f3f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "#fff"
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            {title}
          </Typography>

          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default PageLayout;