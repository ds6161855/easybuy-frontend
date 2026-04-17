import React from "react";
import { Grid, Typography, Divider, Button, Paper } from "@mui/material";
import PageLayout from "../components/PageLayout";

const Advertise = () => {
  return (
    <PageLayout title="Advertise with EasyBuy">

      <Typography mb={2}>
        Promote your products and reach millions of customers.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight="bold">🚀 Boost Sales</Typography>
            <Typography variant="body2">
              Increase visibility of your products.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight="bold">🎯 Target Audience</Typography>
            <Typography variant="body2">
              Reach the right customers easily.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight="bold">📊 Analytics</Typography>
            <Typography variant="body2">
              Track performance in real-time.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mt: 4 }}>
        Start Advertising
      </Button>
    </PageLayout>
  );
};

export default Advertise;