import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useCart } from "../../cart/context/CartContext";

export const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", mt: 4 }}>
        <Typography variant="body1">Votre panier est vide.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontSize: "1.25rem", mb: 2 }}>
        Panier
      </Typography>

      <Stack spacing={2}>
        {items.map((item) => (
          <Stack
            key={`${item.productId}-${item.size}-${item.color}`}
            direction="row"
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Box
              component="img"
              src={item.imageUrl}
              alt={item.productName}
              sx={{
                width: 72,
                height: 72,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.size} · {item.color}
              </Typography>
              <Typography variant="body2">{item.price} €</Typography>
            </Box>

            <Stack direction="row" sx={{ alignItems: "center" }}>
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

            <IconButton
              size="small"
              onClick={() => removeItem(item.productId, item.size, item.color)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Total
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {totalPrice} €
        </Typography>
      </Stack>

      <Button variant="contained" fullWidth>
        Passer commande
      </Button>
    </Box>
  );
};
