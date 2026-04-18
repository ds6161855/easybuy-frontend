import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");

  const query = new URLSearchParams(location.search).get("query");

  // 🔥 Fetch Products
  const fetchProducts = async () => {
    if (!query) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `https://easybuy-backend-xadk.onrender.com/api/products/search?query=${query}&sort=${sort}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, sort]);

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔍 Header */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search results for "{query}"
      </Typography>

      {/* 🔽 Sorting */}
      <TextField
        select
        label="Sort By"
        size="small"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        sx={{ mb: 3, width: 200 }}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="priceLow">Price: Low to High</MenuItem>
        <MenuItem value="priceHigh">Price: High to Low</MenuItem>
      </TextField>

      {/* ⏳ Loader */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.length === 0 ? (
            <Typography>No products found</Typography>
          ) : (
            products.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                 <CardMedia
  component="img"
  height="180"
  image={p.image}   // ✅ direct
  alt={p.name}
  sx={{ objectFit: "contain", p: 1 }}
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/200";
  }}
/>
                  <CardContent>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                    <Typography variant="h6">₹{p.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SearchPage;
