import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Chip
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api/axiosConfig";

const steps = [
  "Order Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

const OrderDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ prevent double API call
  const fetched = useRef(false);

  // ✅ FIX: API CALL ADD KIYA
  useEffect(() => {

    if (fetched.current) return;
    fetched.current = true;

    const fetchOrder = async () => {
      try {

        const userId = localStorage.getItem("userId");

        // ✅ login check (token nahi use karna)
        if (!userId) {
          navigate("/login");
          return;
        }

        const res = await api.get(`/api/orders/${id}`);

        console.log("ORDER DATA:", res.data);

        setOrder(res.data);

      } catch (err) {

        console.error("ORDER ERROR:", err);

        alert("Failed to load order");

      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [id, navigate]);

  // ✅ LOADING
  if (loading) {
    return <Typography p={5}>Loading Order...</Typography>;
  }

  // ❌ NO DATA
  if (!order) {
    return <Typography p={5}>Order not found</Typography>;
  }

  const product = order.productDetails || {};

  const image = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://localhost:8080${product.image}`
    : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";

  const normalize = (s) => s?.toUpperCase();

  const getStep = (status) => {
    switch (normalize(status)) {
      case "PLACED":
        return 0;
      case "PAID":
      case "PACKED":
        return 1;
      case "SHIPPED":
        return 2;
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ p: 4, background: "#f5f5f5", minHeight: "100vh" }}>

      <Typography variant="h5" mb={3}>
        Order Details
      </Typography>

      <Card sx={{ mb: 3 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} md={3}>
            <CardMedia
              component="img"
              image={image}
              sx={{ height: 120, objectFit: "contain" }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <CardContent>

              <Typography variant="h6">
                {product.name || "Product"}
              </Typography>

              <Typography>
                Qty : {order.quantity || 0}
              </Typography>

              <Typography>
                Price : ₹{order.price || 0}
              </Typography>

              <Chip
                label={order.status || "PLACED"}
                color={
                  normalize(order.status) === "DELIVERED"
                    ? "success"
                    : normalize(order.status) === "CANCELLED"
                    ? "error"
                    : "info"
                }
                sx={{ mt: 1 }}
              />

            </CardContent>
          </Grid>

        </Grid>
      </Card>

      {/* ADDRESS */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">
          Delivery Address
        </Typography>

        <Typography>
          {order.address || order.location || "Address not provided"}
        </Typography>

        <Typography>
          {order.city || ""} {order.state || ""}
        </Typography>

        <Typography>
          {order.country || ""}
        </Typography>
      </Card>

      {/* STEPPER */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Delivery Status
        </Typography>

        <Stepper activeStep={getStep(order.status)}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography mt={2}>
          Expected Delivery : {order.deliveryDate || "3-5 Days"}
        </Typography>
      </Card>

    </Box>
  );
};

export default OrderDetail;