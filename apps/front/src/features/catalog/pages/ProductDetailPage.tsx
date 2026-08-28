import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mockProducts } from "../data/mockProducts.js";
import { useStore } from "../../stores/context/StoreContext.js";
import { mockStores } from "../../stores/data/mockStores.js";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedStore } = useStore();
  const product = mockProducts.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Produit introuvable.</Typography>
      </Box>
    );
  }

  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];

  const matchingVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const stockInCurrentStore =
    matchingVariant && selectedStore
      ? (matchingVariant.stockByStore[selectedStore.id] ?? 0)
      : null;

  const otherStoreWithStock =
    matchingVariant && selectedStore
      ? mockStores.find(
          (s) =>
            s.id !== selectedStore.id &&
            (matchingVariant.stockByStore[s.id] ?? 0) > 0,
        )
      : null;

  return (
    <Box>
      <Box
        component="img"
        src={product.imageUrl}
        alt={product.name}
        sx={{ width: "100%", height: 320, objectFit: "cover" }}
      />

      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ fontSize: "1.3rem" }}>
          {product.name}
        </Typography>
        <Typography variant="h5" sx={{ fontSize: "1.1rem", mt: 0.5, mb: 2 }}>
          {product.price} €
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {product.description}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1, fontWeight: "600" }}>
          Taille
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {availableSizes.map((size) => (
            <Chip
              key={size}
              label={size}
              onClick={() => setSelectedSize(size)}
              color={selectedSize === size ? "primary" : "default"}
              variant={selectedSize === size ? "filled" : "outlined"}
            />
          ))}
        </Stack>

        <Typography variant="body2" sx={{ mb: 1, fontWeight: "600" }}>
          Couleur / Finition
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {availableColors.map((color) => (
            <Chip
              key={color}
              label={color}
              onClick={() => setSelectedColor(color)}
              color={selectedColor === color ? "primary" : "default"}
              variant={selectedColor === color ? "filled" : "outlined"}
            />
          ))}
        </Stack>

        {matchingVariant && selectedStore && (
          <Box sx={{ mb: 2 }}>
            {stockInCurrentStore !== null && stockInCurrentStore === 0 && (
              <Alert severity="warning">
                {otherStoreWithStock
                  ? `Disponible dans la boutique de ${otherStoreWithStock.city}`
                  : "Actuellement indisponible dans nos boutiques"}
              </Alert>
            )}
            {stockInCurrentStore !== null &&
              stockInCurrentStore > 0 &&
              stockInCurrentStore < 3 && (
                <Alert severity="info">
                  Plus que {stockInCurrentStore} en stock à {selectedStore.city}
                </Alert>
              )}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          disabled={!matchingVariant}
          sx={{ mb: 3 }}
        >
          Ajouter au panier
        </Button>

        <Accordion elevation={0} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: "600" }}>
              Caractéristiques techniques
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={0.5}>
              {product.specs.map((spec) => (
                <Typography key={spec} variant="body2">
                  • {spec}
                </Typography>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion elevation={0} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: "600" }}>
              Livraison & Retrait
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{product.shippingInfo}</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};
