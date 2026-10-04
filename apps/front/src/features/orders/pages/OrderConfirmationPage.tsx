import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { ordersApi } from "../api/ordersApi.js";
import type { Order } from "../types/order.types.js";

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 30000;

export const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = useState<Order | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (!token) {
      setError("Lien de confirmation invalide.");
      return;
    }

    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const result: Order = await ordersApi.track(token);
        if (isCancelled) return;

        setOrder(result);

        if (result.status === "AWAITING_PAYMENT") {
          if (Date.now() - startedAtRef.current > TIMEOUT_MS) {
            setHasTimedOut(true);
            return;
          }
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Commande introuvable.",
          );
        }
      }
    };

    poll();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [token]);

  if (error) {
    return (
      <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 4, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!order || order.status === "AWAITING_PAYMENT") {
    return (
      <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 6, textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">
          Confirmation du paiement en cours...
        </Typography>
        {hasTimedOut && (
          <Alert severity="warning" sx={{ mt: 2, textAlign: "left" }}>
            Le paiement a été effectué mais la confirmation prend plus de temps
            que prévu. Votre commande sera confirmée sous peu ; vous pouvez
            suivre son statut avec le lien reçu par email.
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 4 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 56, color: "success.main", mb: 1 }}
        />
        <Typography variant="h4" sx={{ fontSize: "1.4rem", mb: 1 }}>
          Commande confirmée
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Un email de confirmation a été envoyé à {order.customerEmail}. Retrait
          disponible environ 1h après la commande.
        </Typography>
        <Stack spacing={1} sx={{ mb: 3, textAlign: "left" }}>
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
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 3 }}>
          Total : {order.totalPrice.toFixed(2)} €
        </Typography>
        <Button
          component={RouterLink}
          to={`/track/${token}`}
          fullWidth
          sx={{ mb: 1 }}
        >
          Voir le suivi de ma commande
        </Button>
        <Button variant="contained" fullWidth onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
      </Paper>
    </Box>
  );
};
