import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
  Paper,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext.js";
import { useStore } from "../../stores/context/StoreContext.js";
import { useIsDesktop } from "../../../shared/hooks/useIsDesktop.js";
import { ordersApi } from "../api/ordersApi.js";

export const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { selectedStore } = useStore();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!selectedStore) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await ordersApi.create({
        storeId: selectedStore.id,
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", mt: 4 }}>
        <Typography variant="body1">Votre panier est vide.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontSize: "1.5rem", mb: 0.5 }}>
        Mon Panier
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {items.length} article{items.length > 1 ? "s" : ""} dans votre panier
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: isDesktop ? "row" : "column",
          alignItems: "flex-start",
        }}
      >
        <Stack spacing={2} sx={{ flex: 1, width: "100%" }}>
          {items.map((item) => (
            <Paper
              key={`${item.productId}-${item.size}-${item.color}`}
              elevation={0}
              sx={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 1,
                p: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "flex-start" }}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.productName}
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.productName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    Taille: {item.size} · {item.color}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          border: "1px solid rgba(0,0,0,0.2)",
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="body2"
                          sx={{ minWidth: 20, textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1,
                            )
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      {item.quantity >= item.maxStock && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", mt: 0.5 }}
                        >
                          Stock maximum atteint ({item.maxStock} disponible
                          {item.maxStock > 1 ? "s" : ""})
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {(item.price * item.quantity).toFixed(2)} €
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 1,
            p: 3,
            width: isDesktop ? 340 : "100%",
            flexShrink: 0,
            position: isDesktop ? "sticky" : "static",
            top: isDesktop ? 88 : "auto",
          }}
        >
          <Typography variant="h4" sx={{ fontSize: "1.2rem", mb: 2 }}>
            Récapitulatif
          </Typography>

          {selectedStore && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Retrait en boutique : {selectedStore.city}
            </Typography>
          )}

          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", mb: 1 }}
          >
            <Typography variant="body2">Sous-total</Typography>
            <Typography variant="body2">{totalPrice.toFixed(2)} €</Typography>
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", mb: 2 }}
          >
            <Typography variant="body2">Click & collect</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              Gratuit
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", mb: 3 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total TTC
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {totalPrice.toFixed(2)} €
            </Typography>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting || !selectedStore}
            onClick={handleCheckout}
          >
            {isSubmitting ? "Validation en cours..." : "Valider mon panier"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontSize: "0.8rem" }}
          >
            🔒 Paiement 100% sécurisé
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
          >
            🚚 Click & collect uniquement
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};
