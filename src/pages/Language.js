import React, { useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import PageLayout from "../components/PageLayout";
import { useTranslation } from "react-i18next";

const Language = () => {

  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // 🔥 Change language instantly
  const handleChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // 🔥 Save button (optional now)
  const handleSave = () => {
    setOpenSnackbar(true);
  };

  const languages = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" }
  ];

  return (
    <PageLayout title={t("language.title")}>

      <Typography mb={2} color="text.secondary">
        {t("language.description")}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <RadioGroup value={language}>
        <Grid container spacing={2}>
          {languages.map((lang) => (
            <Grid size={{ xs: 12, md: 6 }} key={lang.value}>
              
              {/* 🔥 Card UI */}
              <Paper
                onClick={() => handleChange(lang.value)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  border: language === lang.value ? "2px solid #1976d2" : "1px solid #ddd",
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 3
                  }
                }}
              >
                <FormControlLabel
                  value={lang.value}
                  control={<Radio checked={language === lang.value} />}
                  label={
                    <Typography fontWeight={600}>
                      {lang.label}
                    </Typography>
                  }
                />
              </Paper>

            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {/* 🔥 Save Button */}
      <Box mt={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
        >
          {t("common.save")}
        </Button>
      </Box>

      {/* 🔥 Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          {t("common.save")} ✅
        </Alert>
      </Snackbar>

    </PageLayout>
  );
};

export default Language;