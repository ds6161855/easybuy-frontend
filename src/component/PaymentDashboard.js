import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const API = "http://localhost:8080/api/payments";

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    success: 0,
    failed: 0
  });
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const [paymentsRes, statsRes] = await Promise.all([
        axios.get(`${API}/user/${userId}`),
        axios.get(`${API}/stats/${userId}`)
      ]);

      setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);

      setStats({
        revenue: statsRes.data?.revenue || 0,
        success: statsRes.data?.success || 0,
        failed: statsRes.data?.failed || 0
      });

    } catch (err) {
      console.error("Payment fetch error:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const getStatusColor = (status) => {
    const s = status?.toUpperCase();
    if (s === "SUCCESS") return "success";
    if (s === "FAILED") return "error";
    if (s === "PENDING") return "warning";
    return "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Payment Dashboard
      </Typography>

      {/* STATS */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Total Revenue</Typography>
              <Typography variant="h5" color="primary">
                ₹ {Number(stats.revenue).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Successful Payments</Typography>
              <Typography variant="h5" color="success.main">
                {stats.success}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Failed Payments</Typography>
              <Typography variant="h5" color="error.main">
                {stats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TABLE */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Payment History
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>

                    <TableCell>{p.orderId || "-"}</TableCell>

                    <TableCell>
                      ₹ {Number(p.amount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell>
                    <Chip
  label={p.status || "-"}
  color={
    p.status === "SUCCESS" || p.status === "PAID"
      ? "success"
      : "error"
  }
/>
                    </TableCell>

                    <TableCell>
                      {p.paymentDate
                        ? new Date(p.paymentDate).toLocaleString()
                        : "Not Paid Yet"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentDashboard;