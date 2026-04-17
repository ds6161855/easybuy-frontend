import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Grid,
  Dialog,
  IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Orders = () => {

  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);

  const [cancelLoading,setCancelLoading] = useState(null);
  const [payLoading,setPayLoading] = useState(null);

  const [openLogin,setOpenLogin] = useState(false);
  const [openRegister,setOpenRegister] = useState(false);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const navigate = useNavigate();

  // =======================
  // Helper functions
  // =======================
  const getUserId = () => {
    const id = localStorage.getItem("userId");
    if(!id || id === "null" || id === "undefined") return null;
    const parsed = Number(id);
    if(isNaN(parsed)) return null;
    return parsed;
  };

  const getUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const user = getUser();

  const fetchOrders = async () => {
    setLoading(true);
    const userId = getUserId();

    if(!userId){
      setOpenLogin(true);
      setLoading(false);
      return;
    }

    try{
      const res = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
      if(!res.ok) throw new Error("Orders fetch failed");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch(err){
      console.error("Fetch Orders Error:",err);
      setOrders([]);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleUserChange = () => fetchOrders();
    const handleOrderPlaced = () => fetchOrders();

    window.addEventListener("userChanged", handleUserChange);
    window.addEventListener("orderPlaced", handleOrderPlaced);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("orderPlaced", handleOrderPlaced);
    };
  }, []);

  const normalize = (s) => s?.toUpperCase();

  const statusColor = (status)=>{
    const s = normalize(status);
    switch(s){
      case "PLACED": return "info";
      case "PAID":
      case "DELIVERED": return "success";
      case "SHIPPED": return "warning";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  const activeOrders = orders.filter(
    o => ["PLACED","SHIPPED"].includes(normalize(o.status))
  );

  const completedOrders = orders.filter(
    o => ["PAID","DELIVERED","CANCELLED"].includes(normalize(o.status))
  );

  const handleCancel = async (orderId) => {
    if(!window.confirm("Are you sure you want to cancel this order?")) return;

    const userId = getUserId();
    if(!userId){
      setOpenLogin(true);
      return;
    }

    setCancelLoading(orderId);

    try{
      const res = await fetch(
        `http://localhost:8080/api/orders/${orderId}`,
        { method:"DELETE" }
      );
      if(!res.ok) throw new Error("Cancel failed");

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o,status:"CANCELLED" } : o
        )
      );

    } catch(err){
      console.error(err);
      alert("Order cancel failed");
    } finally{
      setCancelLoading(null);
    }
  };

  const handleOpenOrder = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const handleOpenProduct = (order, e) => {
    e.stopPropagation(); // ❗ important (expand na ho)
  
    const product = order.productDetails;
  
    if (!product) return;
  
    // 👉 product save karo (optional but useful)
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  
    // 👉 product detail page open
    navigate(`/product/${product.id}`);
  };

  const handlePay = (order) => {
    const userId = getUserId();
  
    if (!userId) {
      setOpenLogin(true);
      return;
    }
  
    // 👉 order save करो
    localStorage.setItem("payOrder", JSON.stringify(order));
  
    // 👉 wallet page पर भेजो
    navigate("/wallet");
  };

  const generateInvoice = async (order) => {
    const input = document.getElementById(`invoice-${order.id}`);
    if (!input) return;
  
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
  
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    let heightLeft = imgHeight;
    let position = 10;
  
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  
    pdf.save(`Invoice_Order_${order.id}.pdf`);
  };

  if(loading){
    return(
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress/>
      </Box>
    );
  }

  const fallbackImage = "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";

  const renderOrder = (order) => {

    const img = order.productDetails?.image;
  
    const image = img
      ? (img.startsWith("http")
          ? img
          : `http://localhost:8080${img}`)
      : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image";
  
    const orderName = order.name || user?.name || "User";
    const orderMobile = order.mobile || user?.mobile || "N/A";
    const orderAddress = order.address || user?.address || order.location || "Not Provided";

    return(
      <Card sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleOpenOrder(order.id)}>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold">Order #{order.id}</Typography>
            <Chip label={order.status} color={statusColor(order.status)} />
          </Box>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={4} md={2}>
            <CardMedia
  component="img"
  image={image}
  sx={{ height:100,objectFit:"contain", cursor: "pointer" }}
  onClick={(e) => handleOpenProduct(order, e)}
/>
            </Grid>

            <Grid item xs={8} md={10}>
            <Typography
  fontWeight="bold"
  sx={{ cursor: "pointer", color: "#2874f0" }}
  onClick={(e) => handleOpenProduct(order, e)}
>
  {order.productDetails?.name || "Product"}
</Typography>

              <Typography>Qty: {order.quantity}</Typography>
              <Typography>₹ {order.price}</Typography>
              <Typography>{order.productDetails?.brand || ""}</Typography>

              {/* ✅ Flipkart-style user info */}
              <Typography fontWeight="bold">{orderName}</Typography>
              <Typography>{orderMobile}</Typography>
              <Typography variant="body2" color="text.secondary">📍 {orderAddress}</Typography>

            </Grid>
          </Grid>

          {normalize(order.status) === "PLACED" && (
            <Box textAlign="right" mt={2} display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="success"
                disabled={payLoading === order.id}
                onClick={(e)=>{ e.stopPropagation(); handlePay(order); }}
              >
                {payLoading === order.id ? "Processing..." : "Pay Now"}
              </Button>

              <Button
                color="error"
                startIcon={<DeleteIcon/>}
                disabled={cancelLoading === order.id}
                onClick={(e)=>{ e.stopPropagation(); handleCancel(order.id); }}
              >
                {cancelLoading === order.id ? "Cancelling..." : "Cancel"}
              </Button>
            </Box>
          )}

        </CardContent>
        {expandedOrderId === order.id && (
  <Box mt={2} p={2} bgcolor="#fafafa" borderRadius={2}>

    <Divider sx={{ mb: 2 }} />

    <Typography variant="subtitle1" fontWeight="bold">
      Delivery Details
    </Typography>

    <Typography>Name: {orderName}</Typography>
    <Typography>Mobile: {orderMobile}</Typography>
    <Typography>Address: {orderAddress}</Typography>

    <Divider sx={{ my: 2 }} />

    <Typography variant="subtitle1" fontWeight="bold">
      Payment Info
    </Typography>

    <Typography>
      Total Amount: ₹ {order.price * order.quantity}
    </Typography>

    <Typography>
      Payment Status: {order.status === "PAID" ? "Paid" : "Pending"}
    </Typography>

    <Divider sx={{ my: 2 }} />

    <Typography variant="subtitle1" fontWeight="bold">
      Order Timeline
    </Typography>

    <Typography color={order.status === "PLACED" ? "primary" : "text.secondary"}>
      ✔ Order Placed
    </Typography>

    <Typography color={order.status === "SHIPPED" ? "primary" : "text.secondary"}>
      ✔ Shipped
    </Typography>

    <Typography color={order.status === "DELIVERED" ? "primary" : "text.secondary"}>
      ✔ Delivered
    </Typography>

    {order.status === "CANCELLED" && (
      <Typography color="error">
        ✖ Cancelled
      </Typography>
    )}

  </Box>
)}

<Box
  id={`invoice-${order.id}`}
  sx={{
    position: "absolute",
    left: "-9999px",
    top: 0,
    zIndex: -1,
    width: 800,
    p: 3,
    bgcolor: "#fff"
  }}
>

  <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
    EasyBuy Invoice
  </Typography>

  <Divider sx={{ mb: 2 }} />

  {/* Order Info */}
  <Typography><b>Order ID:</b> #{order.id}</Typography>
  <Typography><b>Date:</b> {new Date().toLocaleDateString()}</Typography>

  <Divider sx={{ my: 2 }} />

  {/* Customer */}
  <Typography variant="h6" gutterBottom>Customer Details</Typography>
  <Typography>{orderName}</Typography>
<Typography>{orderMobile}</Typography>
<Typography color="text.secondary">{orderAddress}</Typography>

  <Divider sx={{ my: 2 }} />

  {/* Product */}
  <Typography variant="h6" gutterBottom>Product Details</Typography>

  <Box display="flex" gap={2} alignItems="center">
    <img
      src={
        order.productDetails?.image?.startsWith("http")
          ? order.productDetails.image
          : `http://localhost:8080${order.productDetails?.image}`
      }
      alt=""
      style={{ width: 80, height: 80, objectFit: "contain" }}
    />

    <Box>
      <Typography fontWeight="bold">
        {order.productDetails?.name}
      </Typography>
      <Typography variant="body2">
        Brand: {order.productDetails?.brand}
      </Typography>
      <Typography variant="body2">
        Qty: {order.quantity}
      </Typography>
      <Typography variant="body2">
        Price: ₹ {order.price}
      </Typography>
    </Box>
  </Box>

  <Divider sx={{ my: 2 }} />

  {/* Total */}
  <Typography variant="h6">Total Amount</Typography>
  <Typography fontWeight="bold" fontSize={18}>
    ₹ {order.price * order.quantity}
  </Typography>

  <Typography mt={1}>
    Payment Status:{" "}
    <b>{order.status === "PAID" ? "Paid" : "Pending"}</b>
  </Typography>

  <Divider sx={{ my: 2 }} />

  <Typography align="center" color="text.secondary">
    Thank you for shopping with EasyBuy ❤️
  </Typography>

</Box>

{["PAID", "DELIVERED", "CANCELLED"].includes(normalize(order.status)) && (
  <Box display="flex" gap={2} mt={2}>
    
    {/* Invoice only for PAID & DELIVERED */}
    {["PAID", "DELIVERED"].includes(normalize(order.status)) && (
      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          generateInvoice(order);
        }}
      >
        Download Invoice
      </Button>
    )}

    {/* Help for all completed orders */}
    <Button
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        localStorage.setItem("helpOrder", JSON.stringify(order));
        navigate("/help");
      }}
    >
      Need Help?
    </Button>

  </Box>
)}
      </Card>
    );
  };

  return(
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Typography variant="h4" align="center" mb={4}>My Orders</Typography>

      <Typography variant="h6" mb={2}>Active Orders</Typography>
      {activeOrders.length === 0 ? <Typography>No active orders</Typography> : activeOrders.map(renderOrder)}

      <Divider sx={{ my:5 }}/>

      <Typography variant="h6" mb={2}>Order History</Typography>
      {completedOrders.length === 0 ? <Typography>No past orders</Typography> : completedOrders.map(renderOrder)}

     
      {/* Login/Register Dialogs */}
      <Dialog open={openLogin} onClose={()=>setOpenLogin(false)} maxWidth="sm" fullWidth>
        <Box position="relative">
          <IconButton onClick={()=>setOpenLogin(false)} sx={{ position:"absolute",right:10,top:10 }}>
            <CloseIcon/>
          </IconButton>
          <LoginForm switchToRegister={()=>{ setOpenLogin(false); setOpenRegister(true); }}/>
        </Box>
      </Dialog>

      <Dialog open={openRegister} onClose={()=>setOpenRegister(false)} maxWidth="sm" fullWidth>
        <Box position="relative">
          <IconButton onClick={()=>setOpenRegister(false)} sx={{ position:"absolute",right:10,top:10 }}>
            <CloseIcon/>
          </IconButton>
          <RegisterForm switchToLogin={()=>{ setOpenRegister(false); setOpenLogin(true); }}/>
        </Box>
      </Dialog>
      
    </Box>
  );
};

export default Orders;