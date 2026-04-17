import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Card, CardMedia, CardContent, Typography, Grid, Table, TableBody, TableRow, TableCell,
  Button, Divider, Chip, Rating, Dialog, Stack, IconButton
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  // ✅ USER CHECK
  const getValidUserId = () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id || id === "null" || id === "undefined") return null;
      const parsed = Number(id);
      if (!parsed || isNaN(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  // ================= ADD TO CART =================
  const handleAddToCart = useCallback(async () => {
    if (!product?.id) return alert("Invalid product");
  
    const userId = getValidUserId();
  
    // ✅ NOT LOGGED IN → LOCAL STORAGE
    if (!userId) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      // check same product already hai ya nahi
      const existing = cart.find(i => i.productId === product.id);
      
  
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image
        });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
  
      alert("Added to cart (Guest)");
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }
  
    // ✅ LOGGED IN → BACKEND
    setLoadingCart(true);
  
    try {
      const res = await fetch("https://easybuy-backend-xadk.onrender.com/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: Number(product.id),
          quantity: 1
        })
      });
  
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to add product");
  
      alert("Product added to cart");
  
      
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoadingCart(false);
    }
  }, [product, openLogin, navigate]);
  // ================= BUY NOW =================
  const handleBuyNow = useCallback(async () => {
    const userId = getValidUserId();

    if (!userId) {
      setPendingAction("BUY_NOW");
      if (!openLogin) setOpenLogin(true);
      return;
    }

    setLoadingOrder(true);

    try {
      const res = await fetch("https://easybuy-backend-xadk.onrender.com/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: Number(product.id),
          quantity: 1,
          price: Number(product.price),
          location: "India"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Order failed");

      alert("Order placed successfully");
      window.dispatchEvent(new Event("orderPlaced"));
      navigate("/order");

    } catch (err) {
      alert("Order failed");
    } finally {
      setLoadingOrder(false);
    }
  }, [product, navigate, openLogin]);

  // ================= LOGIN + RETRY =================
  useEffect(() => {
    const retryPendingAction = () => {
      const userId = getValidUserId();
      if (!userId) return;

      setOpenLogin(false);

      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);

        setTimeout(() => {
          if (action === "BUY_NOW") handleBuyNow();
          if (action === "ADD_TO_CART") handleAddToCart();
        }, 300);
      }
    };

    window.addEventListener("userChanged", retryPendingAction);
    return () => {
      window.removeEventListener("userChanged", retryPendingAction);
    };
  }, [pendingAction, handleBuyNow, handleAddToCart]);

  // ================= PRODUCT FETCH =================
  useEffect(() => {
    fetch(`https://easybuy-backend-xadk.onrender.com/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);

        // ✅ FIX: selected image set
        if (data.image) {
          setSelectedImage(
            data.image.startsWith("http")
              ? data.image
              : `https://easybuy-backend-xadk.onrender.com${data.image}`
          );
        }
      })
      .catch(() => {
        alert("Product not found");
        navigate("/");
      });
  }, [id, navigate]);

  if (!product) return <Typography p={5}>Loading...</Typography>;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://easybuy-backend-xadk.onrender.com${product.image}`
    : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";

  return (
    <Box sx={{ background: "#f1f3f6", minHeight: "100vh", p: 4 }}>
      <Grid container spacing={4}>

        {/* ✅ LEFT SIDE (GALLERY ADDED) */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" gap={2}>

              {/* THUMBNAILS */}
              <Box>
                {[imageUrl, imageUrl, imageUrl].map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      border: "1px solid #ccc",
                      mb: 1,
                      cursor: "pointer",
                      p: 1
                    }}
                  >
                    <img src={img} width={60} />
                  </Box>
                ))}
              </Box>

              {/* MAIN IMAGE */}
              <Box>
                <CardMedia
                  component="img"
                  image={selectedImage || imageUrl}
                  sx={{ height: 400, objectFit: "contain" }}
                />
              </Box>
            </Box>

            {/* BUTTONS */}
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddToCart}
                disabled={loadingCart}
                sx={{ background: "#ff9f00", fontWeight: 600, height: 50 }}
              >
                {loadingCart ? "Adding..." : "ADD TO CART"}
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={handleBuyNow}
                disabled={loadingOrder}
                sx={{ background: "#fb641b", fontWeight: 600, height: 50 }}
              >
                {loadingOrder ? "Processing..." : "BUY NOW"}
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* RIGHT SIDE (UNCHANGED + LITTLE POLISH) */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>
                {product.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={4.2} precision={0.5} readOnly />
                <Chip label="4.2 ★" size="small" color="success" />
                <Typography variant="body2">1,234 Ratings</Typography>
              </Box>

              <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" fontWeight="bold">
                  ₹{product.price}
                </Typography>
                <Typography sx={{ textDecoration: "line-through", color: "gray" }}>
                  ₹{product.price + 2000}
                </Typography>
                <Typography color="green" fontWeight={600}>
                  20% off
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Inclusive of all taxes
              </Typography>

              <Chip
                icon={<LocalOfferIcon />}
                label="Special Price"
                color="success"
                sx={{ mt: 2 }}
              />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600}>
                Product Details
              </Typography>

              <Table size="small">
                <TableBody>
                  {[
                    ["Brand", product.brand],
                    ["Category", product.category],
                    ["Color", product.color],
                    ["Storage", product.storage],
                  ].map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: 600, width: "30%" }}>
                        {key}
                      </TableCell>
                      <TableCell>{value || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description || "No description available"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* LOGIN */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="sm" fullWidth>
        <Box position="relative">
          <IconButton onClick={() => setOpenLogin(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>

          <LoginForm
            onSuccess={() => setOpenLogin(false)}
            switchToRegister={() => {
              setOpenLogin(false);
              setOpenRegister(true);
            }}
          />
        </Box>
      </Dialog>

      {/* REGISTER */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="sm" fullWidth>
        <Box position="relative">
          <IconButton onClick={() => setOpenRegister(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>

          <RegisterForm
            switchToLogin={() => {
              setOpenRegister(false);
              setOpenLogin(true);
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}

export default ProductDetail;
