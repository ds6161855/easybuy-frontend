import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, Divider, Table, TableBody, TableRow, TableCell,
  Stack, Chip, Rating, CircularProgress
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";


const CartPage = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ✅ NEW: user state
  const [user, setUser] = useState(null);

  // ================= USER LOAD =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  // ================= USER OR GUEST =================
  const getUserOrGuestId = () => {
    let userId = localStorage.getItem("userId");

    if (userId && userId !== "null" && userId !== "undefined") {
      return userId;
    }

    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "GUEST_" + Date.now();
      localStorage.setItem("guestId", guestId);
    }

    return guestId;
  };

  // ================= FETCH CART =================
  const loadCart = () => {
    setLoading(true);

    const id = getUserOrGuestId();

    fetch(`http://localhost:8080/api/cart/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setCartItems(data);
        } else if (Array.isArray(data.items)) {
          setCartItems(data.items);
        } else if (Array.isArray(data.data)) {
          setCartItems(data.data);
        } else {
          setCartItems([]);
        }
      })
      .catch(() => setCartItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= REMOVE =================
  const removeItem = async (productId) => {
    const userId = getUserOrGuestId();

    try {
      await fetch("http://localhost:8080/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
      });

      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
      setPayLoading(false); // ✅ add this
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async (paymentId = null) => {
    if (!selectedItem) return;
  
    try {
      const userId = getUserOrGuestId();
      const orderUser = user || {};
  
      const res = await fetch("http://localhost:8080/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          productId: selectedItem.productId,
          quantity: selectedItem.quantity || 1,
          price: selectedItem.price,
          paymentId: paymentId,
          paymentMethod: "COD",
          location: "India",
  
          name: orderUser.name || "Guest User",
          mobile: orderUser.mobile || "0000000000",
          address: orderUser.address || "Not Provided"
        })
      });
  
      // ❌ Fail case handle properly
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Order failed");
      }
  
      const data = await res.json(); // optional (future use)
  
      // ✅ SUCCESS
      alert("Order placed successfully 🎉");
  
      await removeItem(selectedItem.productId);
  
    
      setSelectedItem(null);
  
      window.dispatchEvent(new Event("orderPlaced"));
  
      // ✅ better navigation
      window.location.href = "/order";
      setPayLoading(false);
  
    } catch (err) {
      console.error("ORDER ERROR:", err);
  
      // ✅ correct message
      alert("Order failed ❌");
    }
  };

  // ================= TOTAL =================
  const total = Array.isArray(cartItems)
  ? cartItems.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.quantity) || 1;
      return sum + price * qty;
    }, 0)
  : 0;

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // ================= EMPTY =================
  if (cartItems.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" fontWeight={600}>
          Your cart is empty 🛒
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Add some products to continue shopping
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, background: "#fb641b" }}
          onClick={() => window.location.href = "/"}
        >
          CONTINUE SHOPPING
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f1f3f6", minHeight: "100vh", p: 4 }}>
      {cartItems.map(item => {

        const imageUrl = item.image
          ? item.image.startsWith("http")
            ? item.image
            : `http://localhost:8080${item.image}`
          : "https://dummyimage.com/300x300";

        return (
          <Grid container spacing={4} key={item.productId} mb={3}>

            {/* LEFT */}
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Box display="flex" gap={2}>
                  <Box>
                    {[imageUrl, imageUrl, imageUrl].map((img, i) => (
                      <Box key={i} sx={{ border: "1px solid #ccc", mb: 1, p: 1 }}>
                        <img src={img} width={60} alt="product" />
                      </Box>
                    ))}
                  </Box>

                  <CardMedia
                    component="img"
                    image={imageUrl}
                    sx={{ height: 400, objectFit: "contain" }}
                  />
                </Box>

                <Stack direction="row" spacing={2} mt={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => removeItem(item.productId)}
                    sx={{ background: "#ff9f00", fontWeight: 600, height: 50 }}
                  >
                    REMOVE
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSelectedItem(item);
                      placeOrder(); 
                    }}
                    sx={{ background: "#fb641b", fontWeight: 600, height: 50 }}
                  >
                    BUY NOW
                  </Button>
                </Stack>
              </Card>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <CardContent>

                  <Typography variant="h5" fontWeight={600}>
                    {item.name}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Rating value={4.2} precision={0.5} readOnly />
                    <Chip label="4.2 ★" size="small" color="success" />
                    <Typography variant="body2">1,234 Ratings</Typography>
                  </Box>

                  <Box mt={2} display="flex" alignItems="center" gap={2}>
                    <Typography variant="h4" fontWeight="bold">
                      ₹{item.price}
                    </Typography>

                    <Typography sx={{ textDecoration: "line-through", color: "gray" }}>
                      ₹{Number(item.price) + 2000}
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
                        ["Brand", item.brand],
                        ["Category", item.category],
                        ["Color", item.color],
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
                    {item.description || "No description available"}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>

          </Grid>
        );
      })}

      
    </Box>
  );
};

export default CartPage;