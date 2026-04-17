import React, { useState, useEffect } from "react";
import {
  Box, Card, Typography, Grid, TextField,
  Button, Radio, FormControlLabel, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/api/cards";

const isValidUpi = (upi) => /^[\w.-]+@[\w]+$/.test(upi);


// ================= FORMAT =================
const formatCardNumber = (value) =>
  value.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value) => {
  const val = value.replace(/\D/g, "");
  if (val.length <= 2) return val;
  return val.slice(0, 2) + "/" + val.slice(2, 4);
};

// ================= VALIDATION =================
const isValidCard = (num) => {
  let sum = 0, double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = +num[i];
    if (double) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

const getCardType = (num) => {
  if (num.startsWith("4")) return "VISA";
  if (num.startsWith("5")) return "MASTERCARD";
  return "CARD";
};

const WalletDashboard = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [upi, setUpi] = useState("");

  const [cardData, setCardData] = useState({
    name: "", number: "", expiry: "", cvv: ""
  });

  const [formattedNumber, setFormattedNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
const [addMoney, setAddMoney] = useState("");
 

  // ================= FETCH CARDS =================
const fetchCards = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const res = await fetch(`${API}/${userId}`);
    const data = await res.json();

    const cards = Array.isArray(data) ? data : [];
    setSavedCards(cards);

    if (cards.length > 0) setSelectedCard(0);

  } catch (e) {
    console.error(e);
  }
};

// ================= FETCH WALLET =================
const fetchWallet = async () => {
  const userId = localStorage.getItem("userId");
  try {
    const res = await fetch(`${API}/wallet/${userId}`);
    const data = await res.json();
    setWalletBalance(data);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchCards();
    fetchWallet(); // ✅ ADD THIS
  }, []);
  // ================= INPUT =================
  const handleCardNumberChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 16) return;

    setCardData({ ...cardData, number: raw });
    setFormattedNumber(formatCardNumber(raw));
  };

  // ================= VALIDATE =================
  const validate = () => {
    let err = {};

    if (savedCards.some(c => c.number === cardData.number.slice(-4))) {
      err.number = "Card already added";
    }

    if (cardData.name.trim().length < 3)
      err.name = "Invalid name";

    if (!/^\d{16}$/.test(cardData.number))
      err.number = "16 digits required";
    else if (!isValidCard(cardData.number))
      err.number = "Invalid card";

    const [m, y] = cardData.expiry.split("/");
    const now = new Date();
    const cy = now.getFullYear() % 100;
    const cm = now.getMonth() + 1;

    if (!m || m < 1 || m > 12)
      err.expiry = "Invalid month";
    else if (y < cy || (y == cy && m < cm))
      err.expiry = "Card expired";

    if (!/^\d{3}$/.test(cardData.cvv))
      err.cvv = "Invalid CVV";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!validate()) return;

    const userId = localStorage.getItem("userId");

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cardData.name,
          number: cardData.number.slice(-4),
          expiry: cardData.expiry,
          userId: Number(userId)
        })
      });

      alert("Card Saved Successfully");

      fetchCards();
      setCardData({ name: "", number: "", expiry: "", cvv: "" });
      setFormattedNumber("");

    } catch (err) {
      console.error(err);
      alert("Error saving card");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchCards();
  };

  const handleAddMoney = async (amount) => {
    const userId = localStorage.getItem("userId");
  
    try {
      const res = await fetch("http://localhost:8080/api/payments/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          amount: amount
        })
      }); fetchWallet();
  
      const data = await res.json();
  
      const options = {
        key: data.razorpayKey,
        amount: data.amount,
        currency: "INR",
        name: "EasyBuy Wallet",
        description: "Add Money",
  
        order_id: data.id,
  
        handler: async function (response) {
          // ✅ VERIFY + ADD MONEY
          await fetch("http://localhost:8080/api/cards/add-money", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...response,
              userId: userId,
              amount: amount
            })
          });
  
          alert("Money added to wallet ✅");
          fetchWallet(); // refresh balance
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
    } catch (err) {
      console.error(err);
      alert("Error adding money");
    }
  };

  // ================= PAYMENT =================
  const handlePay = async () => {
    const order = JSON.parse(localStorage.getItem("payOrder"));
    if (!order) {
      alert("No order found ❌");
      return;
    }
  
    const totalAmount = Number(order.price) * Number(order.quantity);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in ❌");
      return;
    }
  
    // ================= WALLET PAYMENT =================
    if (paymentMethod === "WALLET") {
      if (walletBalance < totalAmount) {
        alert("Insufficient wallet balance ❌");
        return;
      }
  
      try {
        await fetch("http://localhost:8080/api/cards/add-money", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, amount: -totalAmount })
        });
  
        alert("Payment done using wallet ✅");
        navigate("/order");
      } catch (err) {
        console.error(err);
        alert("Wallet payment failed ❌");
      }
      return;
    }
  
    // ================= VALIDATION =================
    if (paymentMethod === "CARD" && selectedCard === null) {
      alert("Please select a card ❌");
      return;
    }
  
    if (paymentMethod === "UPI" && !isValidUpi(upi)) {
      alert("Enter valid UPI ID ❌");
      return;
    }
  
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded ❌");
      return;
    }
  
    setLoading(true);
  
    try {
      // ================= CREATE RAZORPAY ORDER =================
      const res = await fetch("http://localhost:8080/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: totalAmount })
      });
  
      if (!res.ok) {
        const text = await res.text();
        alert(text);
        setLoading(false);
        return;
      }
  
      const data = await res.json();
      const methodMap = { UPI: "upi", CARD: "card", NET: "netbanking", WALLET: "wallet" };
  
      const options = {
        key: data.razorpayKey,
        amount: data.amount,
        currency: "INR",
        name: "EasyBuy",
        description: "Order Payment",
        order_id: data.id,
        config: {
          display: {
            blocks: {
              upi: { name: "UPI", instruments: [{ method: "upi" }] },
              card: { name: "Card", instruments: [{ method: "card" }] },
              netbanking: { name: "Net Banking", instruments: [{ method: "netbanking" }] },
              wallet: { name: "Wallet", instruments: [{ method: "wallet" }] }
            },
            sequence: [methodMap[paymentMethod] || "card"],
            preferences: { show_default_blocks: false }
          }
        },
        prefill: { contact: "9999999999" },
        handler: async function (response) {
          try {
            await fetch("http://localhost:8080/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });
            alert("Payment Successful 🎉");
            navigate("/order");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed ❌");
          }
        },
        modal: {
          ondismiss: () => alert("Payment Cancelled ❌")
        },
        theme: { color: "#2874f0" }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => alert("Payment Failed ❌"));
      rzp.open();
  
    } catch (err) {
      console.error(err);
      alert("Payment Error ❌");
    } finally {
      setLoading(false);
    }
  };
  // ================= UI =================
  return (
    <Box sx={{ p: 4, bgcolor: "#f1f3f6", minHeight: "100vh" }}>
      <Grid container spacing={3}>

        {/* LEFT */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Payment Options</Typography>

            {["UPI", "WALLET", "CARD", "NET"].map((type) => (
              <FormControlLabel
                key={type}
                control={<Radio checked={paymentMethod === type} />}
                label={type}
                onChange={() => setPaymentMethod(type)}
              />
            ))}
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 8 }}>

          {/* UPI */}
          {paymentMethod === "UPI" && (
  <Card sx={{ p: 3 }}>
    <Typography>UPI Payment</Typography>

    <TextField
      fullWidth
      label="Enter UPI ID (example@upi)"
      value={upi}
      onChange={(e) => setUpi(e.target.value)}
      sx={{ mt: 2 }}
      error={upi && !isValidUpi(upi)}
      helperText={upi && !isValidUpi(upi) ? "Invalid UPI ID" : ""}
    />

    <Button
      fullWidth
      sx={{ mt: 2 }}
      variant="contained"
      disabled={!isValidUpi(upi)}
      onClick={handlePay}
    >
      Pay via UPI
    </Button>
  </Card>
)}

{paymentMethod === "NET" && (
  <Card sx={{ p: 3 }}>
    <Typography variant="h6">Net Banking</Typography>

    <Button
      fullWidth
      variant="contained"
      sx={{ mt: 2 }}
      onClick={handlePay}
    >
      Select Bank & Pay
    </Button>
  </Card>
)}

{paymentMethod === "WALLET" && (
  <Card sx={{ p: 3 }}>
    <Typography variant="h6">Wallet Balance: ₹{walletBalance}</Typography>

    <TextField
      fullWidth
      label="Add Money"
      value={addMoney}
      onChange={(e) => setAddMoney(e.target.value)}
      sx={{ mt: 2 }}
    />

<Button
  fullWidth
  variant="contained"
  sx={{ mt: 2 }}
  onClick={async () => {
    const amount = Number(addMoney);
  
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }
  
    await handleAddMoney(amount);
  }}
>
  Add Money
</Button>

    <Button
      fullWidth
      variant="outlined"
      sx={{ mt: 2 }}
      onClick={handlePay}
      disabled={loading}
      
    >
      Pay from Wallet
    </Button>
  </Card>
)}

          {/* CARD */}
          {paymentMethod === "CARD" && (
            <>
              <Typography>Saved Cards</Typography>

              {savedCards.map((card, i) => (
                <Card key={card.id} sx={{ p: 2, mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedCard === i}
                        onChange={() => setSelectedCard(i)}
                      />
                    }
                    label={`${getCardType(card.number)} **** ${card.number}`}
                  />
                  <IconButton onClick={() => handleDelete(card.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Card>
              ))}

              <Card sx={{ p: 3, mt: 2 }}>
                <Typography>Add Card</Typography>

                <TextField fullWidth label="Name" sx={{ mt: 2 }}
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <TextField fullWidth label="Card Number" sx={{ mt: 2 }}
                  value={formattedNumber}
                  onChange={handleCardNumberChange}
                  error={!!errors.number}
                  helperText={errors.number}
                />

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField fullWidth label="Expiry"
                      value={cardData.expiry}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      error={!!errors.expiry}
                      helperText={errors.expiry}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField fullWidth label="CVV"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 3)
                        })}
                      error={!!errors.cvv}
                      helperText={errors.cvv}
                    />
                  </Grid>
                </Grid>

                <Button fullWidth sx={{ mt: 2 }} onClick={handleSave}>
                  Save Card
                </Button>
              </Card>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue to Pay"}
              </Button>
            </>
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default WalletDashboard;