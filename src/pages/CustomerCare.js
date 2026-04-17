import React from "react";
import {
  Grid,
  Typography,
  Divider,
  Button,
  TextField
} from "@mui/material";
import PageLayout from "../components/PageLayout";

const CustomerCare = () => {
  return (
    <PageLayout title="Customer Support">

      <Typography mb={2}>
        Need help? Reach out to us anytime.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography>📞 Phone: 1800-123-456</Typography>
          <Typography>📧 Email: support@easybuy.com</Typography>

          <Button variant="contained" sx={{ mt: 2 }}>
            Start Live Chat
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography mb={1}>Raise a Ticket</Typography>

          <TextField fullWidth label="Subject" sx={{ mb: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe your issue"
          />

          <Button variant="contained" sx={{ mt: 2 }}>
            Submit Ticket
          </Button>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default CustomerCare;