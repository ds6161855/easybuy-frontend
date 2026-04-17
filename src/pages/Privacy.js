import React from "react";
import { Typography, Divider, Box } from "@mui/material";
import PageLayout from "../components/PageLayout";

const Privacy = () => {
  return (
    <PageLayout title="Privacy Policy">

      <Typography color="text.secondary" mb={2}>
        Your privacy is important to us. This policy explains how we collect and use your data.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <Typography variant="h6">1. Information We Collect</Typography>
        <Typography variant="body2">
          We collect personal details like name, email, phone number, and address to process orders.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">2. How We Use Information</Typography>
        <Typography variant="body2">
          We use your information to improve services, process payments, and provide better customer support.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">3. Data Security</Typography>
        <Typography variant="body2">
          We use secure servers and encryption to protect your data.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">4. Third-party Services</Typography>
        <Typography variant="body2">
          We may share data with trusted partners for payments and delivery.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6">5. Contact Us</Typography>
        <Typography variant="body2">
          For any queries, contact support@easybuy.com
        </Typography>
      </Box>

    </PageLayout>
  );
};

export default Privacy;