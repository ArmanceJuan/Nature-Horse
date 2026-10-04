import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { Order } from "../types/order.types.js";
import { OrderStatusChip } from "./OrderStatusChip.js";

interface OrderCardProps {
  order: Order;
  onCancel: () => Promise<void>;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const OrderCard = ({ order, onCancel }: OrderCardProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canBeCancelled =
    order.status === "PENDING" || order.status === "READY_FOR_PICKUP";

  const handleCancel = async () => {
    setError(null);
    setIsCancelling(true);

    try {
      await onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'annulation a échoué.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Commande du {formatDate(order.createdAt)}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {order.totalPrice.toFixed(2)} €
          </Typography>
        </Box>
        <OrderStatusChip status={order.status} />
      </Stack>

      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
        {order.items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography variant="body2">
              {item.productName} × {item.quantity}
            </Typography>
            <Typography variant="body2">
              {(item.unitPrice * item.quantity).toFixed(2)} €
            </Typography>
          </Stack>
        ))}
      </Stack>

      {order.status === "READY_FOR_PICKUP" && (
        <Alert severity="success" sx={{ mb: 1.5 }}>
          Votre commande est prête à être retirée en boutique.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}

      {canBeCancelled && (
        <Button
          size="small"
          color="error"
          disabled={isCancelling}
          onClick={handleCancel}
        >
          {isCancelling ? "Annulation..." : "Annuler la commande"}
        </Button>
      )}
    </Paper>
  );
};
