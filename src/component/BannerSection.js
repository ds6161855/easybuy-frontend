import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSection = () => {
  const banners = [
    {
      title: "Mobile",
      img: "https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/d11be0f28c8ad678.jpg?q=80",
    },
    {
      title: "Fashion",
      img: "https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/62f00f299870c1ab.png?q=80",
    },
    {
      title: "Electronics",
      img: "https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/7c21c140219f583c.jpg?q=80",
    },
    {
      title: "Home Appliances",
      img: "https://rukminim1.flixcart.com/fk-p-flap/920/448/image/a93602993a7fd664.jpg?q=80",
    },
    {
      title: "Sports",
      img: "https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/b3f962cd2cb1da9b.jpg?q=80",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", mt: 2, px: 1 }}>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <Box key={index} sx={{ px: 1 }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 120, sm: 160, md: 220 },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
                position: "relative",
                backgroundImage: `url(${banner.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {banner.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerSection;