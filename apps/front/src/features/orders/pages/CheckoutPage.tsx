import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCart } from "../../cart/context/CartContext.js";
import { useStore } from "../../stores/context/StoreContext.js";
import { useAuth } from "../../auth/context/AuthContext.js";
import { ordersApi } from "../api/ordersApi.js";
import type { CreatedOrderResponse } from "../types/order.types.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { selectedStore } = useStore();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", mt: 4 }}>
        <Typography variant="body1">Votre panier est vide.</Typography>
      </Box>
    );
  }

  if (!selectedStore) {
    return (
      <Box sx={{ p: 2, textAlign: "center", mt: 4 }}>
        <Typography variant="body1">
          Choisissez une boutique avant de commander.
        </Typography>
      </Box>
    );
  }

  const validateGuest = (): string[] => {
    if (user) return [];

    const problems: string[] = [];
    if (!EMAIL_PATTERN.test(email.trim()))
      problems.push("Une adresse email valide est requise.");
    if (firstName.trim() === "") problems.push("Le prénom est obligatoire.");
    if (lastName.trim() === "") problems.push("Le nom est obligatoire.");
    return problems;
  };

  const handlePay = async () => {
    const problems = validateGuest();
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const response: CreatedOrderResponse = await ordersApi.create({
        storeId: selectedStore.id,
        customer: user
          ? undefined
          : {
              email: email.trim(),
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phone: phone.trim() || undefined,
            },
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      window.location.href = response.checkoutUrl;
    } catch (err) {
      setErrors([
        err instanceof Error
          ? err.message
          : "La création de la commande a échoué.",
      ]);
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontSize: "1.5rem", mb: 3 }}>
        Finaliser la commande
      </Typography>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </Alert>
      )}

      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
        >
          <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 2 }}>
            Récapitulatif
          </Typography>
          <Stack spacing={1}>
            {items.map((item) => (
              <Stack
                key={`${item.productId}-${item.size}-${item.color}`}
                direction="row"
                sx={{ justifyContent: "space-between" }}
              >
                <Typography variant="body2">
                  {item.productName} ({item.size}, {item.color}) ×{" "}
                  {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {(item.price * item.quantity).toFixed(2)} €
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {totalPrice.toFixed(2)} €
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Retrait en boutique : {selectedStore.city}, disponible environ 1h
            après la commande.
          </Typography>
        </Paper>

        {user ? (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 1,
              p: 2.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Commande passée avec le compte {user.email}.
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 1,
              p: 2.5,
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 0.5 }}>
              Vos coordonnées
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vous n'êtes pas connectée. Renseignez vos coordonnées pour suivre
              votre commande, ou{" "}
              <Button
                size="small"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              >
                connectez-vous
              </Button>
              .
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                />
              </Stack>
              <TextField
                label="Téléphone (optionnel)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
            </Stack>
          </Paper>
        )}

        <Button
          variant="contained"
          size="large"
          disabled={isSubmitting}
          onClick={handlePay}
        >
          {isSubmitting
            ? "Redirection vers le paiement..."
            : `Payer ${totalPrice.toFixed(2)} €`}
        </Button>
      </Stack>
    </Box>
  );
};
