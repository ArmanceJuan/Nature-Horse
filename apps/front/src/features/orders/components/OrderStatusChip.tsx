import { Chip } from "@mui/material";
import type { OrderStatus } from "../types/order.types.js";

const LABELS: Record<OrderStatus, string> = {
  AWAITING_PAYMENT: "En attente de paiement",
  PENDING: "En préparation",
  READY_FOR_PICKUP: "Prête à retirer",
  PICKED_UP: "Retirée",
  CANCELLED: "Annulée",
};

const COLORS: Record<
  OrderStatus,
  "default" | "warning" | "info" | "success" | "error"
> = {
  AWAITING_PAYMENT: "warning",
  PENDING: "info",
  READY_FOR_PICKUP: "success",
  PICKED_UP: "default",
  CANCELLED: "error",
};

export const OrderStatusChip = ({ status }: { status: OrderStatus }) => (
  <Chip size="small" label={LABELS[status]} color={COLORS[status]} />
);
