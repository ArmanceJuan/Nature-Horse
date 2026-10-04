import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { ordersApi } from "../api/ordersApi.js";
import type { Order } from "../types/order.types.js";
import { OrderCard } from "../components/OrderCard.js";

export const OrderTrackingPage = () => {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrder = async () => {
    if (!token) return;

    try {
      const result: Order = await ordersApi.track(token);
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Commande introuvable.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCancel = async () => {
    if (!token) return;
    await ordersApi.cancelByToken(token);
    await loadOrder();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 4 }}>
        <Alert severity="error">{error ?? "Commande introuvable."}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ fontSize: "1.4rem", mb: 2 }}>
        Suivi de commande
      </Typography>
      <OrderCard order={order} onCancel={handleCancel} />
    </Box>
  );
};
