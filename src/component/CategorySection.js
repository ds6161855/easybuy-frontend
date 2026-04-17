import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "grocery",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png"
    },
    {
      name: "mobile",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "fashion",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/0d75b34f7d8fbcb3.png"
    },
    {
      name: "electronics",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/69c6589653afdb9a.png"
    },
    {
      name: "home",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/ab7e2b022a4587dd.jpg"
    },
    {
      name: "appliances",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/0139228b2f7eb413.jpg"
    },
    {
      name: "travel",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/71050627a56b4693.png"
    },
    {
      name: "beauty",
      image: "https://rukminim1.flixcart.com/flap/64/64/image/dff3f7adcf3a90c6.png"
    }
  ];

  const [category, setCategory] = useState(categories[0].name);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;

    setLoading(true);

    fetch(`http://localhost:8080/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [category]);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>

      {/* 🔵 CATEGORY SECTION */}
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Shop by Category
      </Typography>

      <Grid
        container
        spacing={16}
        justifyContent="center"
        sx={{ mb: 6 }}
      >
        {categories.map(cat => {
          const isActive = cat.name === category;

          return (
            <Grid item xs={6} sm={3} md={1.5} key={cat.name}>
              <Box
                onClick={() => setCategory(cat.name)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive
                      ? "linear-gradient(135deg,#2874f0,#42a5f5)"
                      : "#f5f5f5",
                    transition: "0.3s",
                    boxShadow: isActive ? 4 : 0
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: "70%",
                        height: "70%",
                        objectFit: "contain"
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  mt={1.5}
                  fontSize={14}
                  fontWeight={600}
                  sx={{
                    color: isActive ? "#2874f0" : "#000"
                  }}
                >
                  {cat.name.toUpperCase()}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* 🟡 PRODUCTS SECTION */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        {category.toUpperCase()} Products
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          No Products Found
        </Typography>
      ) : (
        <Grid container spacing={8}>
          {products.map(p => (
            <Grid item xs={12} sm={6} md={3} key={p.id}>
             <Card
  onClick={() => navigate(`/product/${p.id}`)}
  sx={{
    cursor: "pointer",
    borderRadius: 3,
    overflow: "hidden",
    transition: "0.3s",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: 6
    }
  }}
>
  {/* ✅ IMAGE FIXED BOX */}
  <Box
    sx={{
      height: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      p: 2
    }}
  >
    <img
      src={p.image}
      alt={p.name}
      style={{
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain"
      }}
      onError={(e) => {
        e.target.src =
          "https://via.placeholder.com/300x300?text=No+Image";
      }}
    />
  </Box>

  {/* ✅ CONTENT */}
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography fontWeight="bold" noWrap>
      {p.name}
    </Typography>

    <Typography
      sx={{
        color: "#388e3c",
        fontWeight: 700,
        mt: 1
      }}
    >
      ₹ {p.price}
    </Typography>
  </CardContent>
</Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CategorySection;