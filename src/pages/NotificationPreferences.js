import React, { useState } from "react";
import {
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Typography,
  Button
} from "@mui/material";
import PageLayout from "../components/PageLayout";

const NotificationPreferences = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    offers: true,
    orderUpdates: true
  });

  const handleChange = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    console.log(settings);
    alert("Preferences Saved ✅");
  };

  return (
    <PageLayout title="Notification Preferences">
      <Typography color="text.secondary" mb={2}>
        Control how you receive updates and alerts.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {Object.keys(settings).map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings[key]}
                  onChange={() => handleChange(key)}
                />
              }
              label={key.toUpperCase()}
            />
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>
        Save Changes
      </Button>
    </PageLayout>
  );
};

export default NotificationPreferences;