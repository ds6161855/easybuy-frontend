import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import PageLayout from "../components/PageLayout";

const DownloadApp = () => {
  return (
    <PageLayout title="Download EasyBuy App">

      <Typography mb={2}>
        Shop faster, track orders, and get exclusive deals on our mobile app.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{ mr: 2, px: 4 }}
        >
          Google Play
        </Button>

        <Button
          variant="outlined"
          sx={{ px: 4 }}
        >
          App Store
        </Button>
      </Box>

      <Typography mt={4} textAlign="center" color="text.secondary">
        Coming soon with exciting features 🚀
      </Typography>

    </PageLayout>
  );
};

export default DownloadApp;