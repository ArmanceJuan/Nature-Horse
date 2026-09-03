import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { mockProducts } from "../data/mockProducts.js";
import { useStore } from "../../stores/context/StoreContext.js";
import { mockStores } from "../../stores/data/mockStores.js";
import { useCart } from "../../cart/context/CartContext.js";
import { useIsDesktop } from "../../../shared/hooks/useIsDesktop.js";

const COLLECTION_LABELS: Record<string, string> = {
  "textile-performance": "Cavalier",
  "haute-sellerie": "Cheval",
};

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const isDesktop = useIsDesktop();
  const product = mockProducts.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  const isOutOfStock =
    stockInCurrentStore !== null && stockInCurrentStore === 0;
  const canAddToCart = matchingVariant && selectedStore && !isOutOfStock;

  const cartItem = matchingVariant
    ? items.find(
        (i) =>
          i.productId === product.id &&
          i.size === matchingVariant.size &&
          i.color === matchingVariant.color,
      )
    : undefined;
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!canAddToCart || !matchingVariant) return;
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      size: matchingVariant.size,
      color: matchingVariant.color,
      quantity: 1,
      maxStock: stockInCurrentStore ?? 0,
    });
  };

  const handleIncrease = () => {
    if (!matchingVariant) return;
    updateQuantity(
      product.id,
      matchingVariant.size,
      matchingVariant.color,
      quantityInCart + 1,
    );
  };

  const handleDecrease = () => {
    if (!matchingVariant) return;
    if (quantityInCart <= 1) {
      removeItem(product.id, matchingVariant.size, matchingVariant.color);
    } else {
      updateQuantity(
        product.id,
        matchingVariant.size,
        matchingVariant.color,
        quantityInCart - 1,
      );
    }
  };

  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/")}
          underline="hover"
          color="text.secondary"
        >
          Accueil
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/shop?collection=${product.collection}`)}
          underline="hover"
          color="text.secondary"
        >
          {COLLECTION_LABELS[product.collection]}
        </Link>
        <Typography variant="body2" color="text.primary">
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: isDesktop ? "row" : "column",
        }}
      >
        <Box sx={{ flex: isDesktop ? "0 0 50%" : "1" }}>
          <Box
            component="img"
            src={product.images[selectedImageIndex]}
            alt={product.name}
            sx={{
              width: "100%",
              height: isDesktop ? 480 : 320,
              objectFit: "cover",
              borderRadius: 1,
              mb: 1,
            }}
          />
          <Stack direction="row" spacing={1}>
            {product.images.map((img, index) => (
              <Box
                key={img}
                component="img"
                src={img}
                onClick={() => setSelectedImageIndex(index)}
                sx={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    index === selectedImageIndex
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor:
                    index === selectedImageIndex
                      ? "primary.main"
                      : "transparent",
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {product.description}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontSize: "1.4rem", fontWeight: 700, mb: 2 }}
          >
            {product.price} €
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
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

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
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
                    Plus que {stockInCurrentStore} en stock à{" "}
                    {selectedStore.city}
                  </Alert>
                )}
            </Box>
          )}

          {quantityInCart === 0 ? (
            <Button
              variant="contained"
              fullWidth
              disabled={!canAddToCart}
              sx={{ mb: 3 }}
              onClick={handleAdd}
            >
              {isOutOfStock
                ? "Indisponible dans cette boutique"
                : "Ajouter au panier"}
            </Button>
          ) : (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 1,
                px: 2,
                py: 0.5,
                mb: 3,
              }}
            >
              <IconButton onClick={handleDecrease} color="primary">
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {quantityInCart}
              </Typography>
              <IconButton
                onClick={handleIncrease}
                color="primary"
                disabled={quantityInCart >= (stockInCurrentStore ?? 0)}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          )}

          <Accordion elevation={0} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Livraison & Retrait
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{product.shippingInfo}</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};
