import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ordersApi } from "../api/ordersApi.js";
import type { Order } from "../types/order.types.js";
import { OrderCard } from "./OrderCard.js";

export const OrderHistorySection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const result: Order[] = await ordersApi.getMine();
      setOrders(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger l'historique.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    await ordersApi.cancelMine(orderId);
    await loadOrders();
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
    >
      <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 2 }}>
        Mes commandes
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : orders.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Vous n'avez pas encore passé de commande.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={() => handleCancel(order.id)}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
};
