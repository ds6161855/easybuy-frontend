import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const HelpChat = () => {

  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState(null);

  const chatRef = useRef();

  useEffect(() => {
    const o = JSON.parse(localStorage.getItem("helpOrder"));
    if (o) setOrder(o);

    setMessages([
      { type: "bot", text: "Hi 👋, how can I help you today?" }
    ]);
  }, []);

  // Auto scroll bottom
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, { type, text }]);
  };

  // fake typing delay (PRO feel)
  const botReply = (text) => {
    setTimeout(() => {
      addMessage("bot", text);
    }, 500);
  };

  const handleOptionClick = (option) => {
    addMessage("user", option);

    if (step === 0) {
      setStep(1);

      if (option === "Order Issue") {
        botReply("What problem are you facing?");
      }

      if (option === "Payment Issue") {
        botReply("Select your payment issue:");
      }

      if (option === "Refund") {
        botReply("Refund usually takes 5-7 business days.");
      }
    }

    else if (step === 1) {
      setStep(2);

      botReply("We understand your issue.");
      botReply("Do you want to raise a support request?");
    }

    else if (step === 2) {
      if (option === "Yes") {
        handleRaiseTicket();
      } else {
        botReply("Okay 👍 Let me know if you need anything else.");
      }
    }
  };

  const handleRaiseTicket = async () => {
    botReply("Creating your request...");

    try {
      await fetch("https://easybuy-backend-xadk.onrender.com/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order?.id,
          issue: "AUTO",
          description: "Raised from chat"
        })
      });

      botReply("✅ Your request has been submitted successfully!");
    } catch (err) {
      botReply("❌ Failed to submit request. Try again later.");
    }
  };

  // Options UI (Chip style like Flipkart)
  const renderOptions = () => {

    const style = {
      m: 0.5,
      cursor: "pointer"
    };

    if (step === 0) {
      return (
        <>
          <Chip label="Order Issue" onClick={() => handleOptionClick("Order Issue")} sx={style} />
          <Chip label="Payment Issue" onClick={() => handleOptionClick("Payment Issue")} sx={style} />
          <Chip label="Refund" onClick={() => handleOptionClick("Refund")} sx={style} />
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <Chip label="Not Delivered" onClick={() => handleOptionClick("Not Delivered")} sx={style} />
          <Chip label="Damaged Product" onClick={() => handleOptionClick("Damaged")} sx={style} />
          <Chip label="Wrong Item" onClick={() => handleOptionClick("Wrong Item")} sx={style} />
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Chip label="Yes" color="success" onClick={() => handleOptionClick("Yes")} sx={style} />
          <Chip label="No" color="error" onClick={() => handleOptionClick("No")} sx={style} />
        </>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#eaeef3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 400,
          height: 600,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden"
        }}
      >

        {/* HEADER */}
        <Box
          sx={{
            bgcolor: "#2874f0",
            color: "#fff",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Avatar sx={{ bgcolor: "#fff", color: "#2874f0" }}>
            <SupportAgentIcon />
          </Avatar>
          <Box>
            <Typography fontWeight="bold">Help Center</Typography>
            <Typography variant="caption">We’re here to help</Typography>
          </Box>
        </Box>

        {/* CHAT BODY */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            bgcolor: "#f9fafc"
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent={msg.type === "user" ? "flex-end" : "flex-start"}
              mb={1}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "75%",
                  bgcolor: msg.type === "user" ? "#2874f0" : "#e0e0e0",
                  color: msg.type === "user" ? "#fff" : "#000",
                  boxShadow: 1
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={chatRef}></div>
        </Box>

        <Divider />

        {/* OPTIONS */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {renderOptions()}
        </Box>

      </Paper>
    </Box>
  );
};

export default HelpChat;
