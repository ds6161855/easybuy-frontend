import React from "react";

import CategorySection from "../component/CategorySection";
import BannerSection from "../component/BannerSection";
import Footer from "../components/Footer";
import { Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box sx={{ background: "#f1f3f6" }}>
     <BannerSection />
      <CategorySection />
             <Footer />
    </Box>
  );
};

export default HomePage;