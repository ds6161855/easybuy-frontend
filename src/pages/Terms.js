import React from "react";
import { Typography, Divider, Box } from "@mui/material";
import PageLayout from "../components/PageLayout";

const Terms = () => {
  return (
    <PageLayout title="Terms & Conditions">

      <Typography color="text.secondary" mb={2}>
        Please read these terms carefully before using EasyBuy services.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <Typography variant="h6">1. Account Responsibility</Typography>
        <Typography variant="body2">
          Users are responsible for maintaining the confidentiality of their accounts.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">2. Orders & Payments</Typography>
        <Typography variant="body2">
          All orders are subject to availability and payment confirmation.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">3. Returns & Refunds</Typography>
        <Typography variant="body2">
          Returns are accepted as per our return policy within the specified period.
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h6">4. Prohibited Activities</Typography>
        <Typography variant="body2">
          Users must not misuse the platform or engage in fraudulent activities.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6">5. Changes to Terms</Typography>
        <Typography variant="body2">
          We reserve the right to update these terms at any time.
        </Typography>
      </Box>

    </PageLayout>
  );
};

export default Terms;