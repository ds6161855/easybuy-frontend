import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Button,
  TextField, Divider, Snackbar, Alert,
  CircularProgress, Card, CardContent, CardMedia, Chip
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarningIcon from "@mui/icons-material/Warning";

const SellerDashboardPage = () => {

  // 🔥 SELLER DETAILS
  const seller = JSON.parse(localStorage.getItem("seller"));
  const phone = seller?.phone;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previews, setPreviews] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    description: ""
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (!phone) window.location.href = "/";
  }, []);

  // 🔹 INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 MULTIPLE IMAGE UPLOAD (MAX 5)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

  // 🔥 ADD PRODUCT (WITH STATUS)
  const addProduct = async () => {
    if (!productForm.name || !productForm.price) {
      return setSnack({ open: true, message: "Name & price required", severity: "warning" });
    }

    setLoading(true);

    try {
      const newProduct = {
        ...productForm,
        images: previews,
        sellerPhone: phone,
        status: "PENDING"
      };

      setProducts(prev => [newProduct, ...prev]);

      setSnack({ open: true, message: "Sent for Approval ✅", severity: "success" });

      setProductForm({
        name: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        description: ""
      });

      setPreviews([]);

    } catch {
      setSnack({ open: true, message: "Error", severity: "error" });
    }

    setLoading(false);
  };

  const totalRevenue = Array.isArray(products)
    ? products.reduce((acc, p) => acc + Number(p.price || 0), 0)
    : 0;

  return (
    <Box sx={{ display: "flex", bgcolor: "#f1f3f6", minHeight: "100vh" }}>

      {/* 🔥 SIDEBAR */}
      <Box sx={{ width: 220, bgcolor: "#fff", p: 2, borderRight: "1px solid #ddd" }}>
        
        {/* SELLER INFO */}
        <Typography fontWeight="bold">{seller?.name}</Typography>
        <Typography fontSize={12} mb={2}>{seller?.email}</Typography>

        <Button fullWidth startIcon={<DashboardIcon />} sx={{ justifyContent: "flex-start", mb: 1 }} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </Button>

        <Button fullWidth startIcon={<AddBoxIcon />} sx={{ justifyContent: "flex-start" }} onClick={() => setActiveTab("add")}>
          Add Product
        </Button>
        <Button fullWidth startIcon={<icon />} sx={{ justifyContent: "flex-start" }} onClick={() => setActiveTab("add")}>
          Account Details
        </Button>
      </Box>

      {/* 🔥 MAIN */}
      <Box sx={{ flex: 1, p: 3 }}>

        <Typography variant="h5" fontWeight="bold" mb={2}>Seller Dashboard</Typography>

        {activeTab === "dashboard" && (
          <>
            {/* CARDS */}
            <Grid container spacing={2} mb={3}>

              {[{
                title: "Products",
                value: products.length,
                icon: <Inventory2OutlinedIcon sx={{ fontSize: 40 }} />
              }, {
                title: "Orders",
                value: 0,
                icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />
              }, {
                title: "Revenue",
                value: `₹${totalRevenue}`,
                icon: <CurrencyRupeeIcon sx={{ fontSize: 40 }} />
              }, {
                title: "Low Stock",
                value: products.length < 3 ? products.length : 0,
                icon: <WarningIcon sx={{ fontSize: 40, color: "red" }} />
              }].map((card, i) => (
                <Grid item xs={12} md={3} key={i}>
                  <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", borderRadius: 3, boxShadow: 3 }}>
                    <Box>
                      <Typography color="text.secondary">{card.title}</Typography>
                      <Typography variant="h5">{card.value}</Typography>
                    </Box>
                    {card.icon}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* PRODUCTS */}
            <Paper sx={{ p: 3 }}>
              <Typography fontWeight="bold">My Products</Typography>
              <Divider sx={{ my: 2 }} />

              {products.length === 0 ? (
                <Typography>No products added</Typography>
              ) : (
                <Grid container spacing={2}>
                  {products.map((p, i) => (
                    <Grid item xs={12} md={3} key={i}>
                      <Card>

                        <CardMedia component="img" height="140" image={p.images?.[0]} />

                        <CardContent>
                          <Typography fontWeight="bold">{p.name}</Typography>
                          <Typography>₹{p.price}</Typography>
                          <Typography variant="caption">{p.category}</Typography>

                          <Typography variant="body2">{p.brand}</Typography>

                          {/* STATUS */}
                          <Box mt={1}>
                            <Chip
                              label={p.status}
                              color={p.status === "APPROVED" ? "success" : "warning"}
                            />
                          </Box>

                        </CardContent>

                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </>
        )}

        {/* 🔥 ADD PRODUCT */}
        {activeTab === "add" && (
          <Paper sx={{ p: 3, maxWidth: 400 }}>
            <Typography fontWeight="bold">Add Product</Typography>
            <Divider sx={{ my: 2 }} />

            {/* MULTIPLE IMAGE */}
            <Box
              sx={{ border: "2px dashed #2874f0", textAlign: "center", p: 2, mb: 2, cursor: "pointer" }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {previews.length ? previews.map((img, i) => (
                <img key={i} src={img} style={{ width: 60, margin: 5 }} />
              )) : (
                <>
                  <CloudUploadIcon />
                  <Typography>Upload up to 5 images</Typography>
                </>
              )}

              <input id="fileInput" type="file" multiple hidden onChange={handleFileUpload} />
            </Box>

            <TextField fullWidth label="Name" name="name" value={productForm.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Price" name="price" value={productForm.price} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Brand" name="brand" value={productForm.brand} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Category" name="category" value={productForm.category} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Stock" name="stock" value={productForm.stock} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Description" name="description" multiline rows={3} value={productForm.description} onChange={handleChange} sx={{ mb: 2 }} />

            <Button fullWidth variant="contained" onClick={addProduct} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Send for Approval"}
            </Button>
          </Paper>
        )}

      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>

    </Box>
  );
};

export default SellerDashboardPage;