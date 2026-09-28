import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { productsApi } from "../api/productsApi.js";
import type { Product } from "../types/product.types.js";
import { useStore } from "../../stores/context/StoreContext.js";
import { useCart } from "../../cart/context/CartContext.js";
import { useIsDesktop } from "../../../shared/hooks/useIsDesktop.js";

const getAttributeValue = (
  variant: Product["variants"][number],
  attributeName: string,
): string | undefined =>
  variant.attributeValues.find((av) => av.attributeName === attributeName)
    ?.value;

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedStore, stores } = useStore();
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const isDesktop = useIsDesktop();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const result: Product = await productsApi.getById(id);
        setProduct(result);
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Produit introuvable.</Typography>
      </Box>
    );
  }

  const category = product.category;

  const availableSizes = [
    ...new Set(
      product.variants
        .map((v) => getAttributeValue(v, "Taille"))
        .filter((v): v is string => !!v),
    ),
  ];
  const availableColors = [
    ...new Set(
      product.variants
        .map((v) => getAttributeValue(v, "Couleur"))
        .filter((v): v is string => !!v),
    ),
  ];

  const matchingVariant = product.variants.find(
    (v) =>
      getAttributeValue(v, "Taille") === selectedSize &&
      getAttributeValue(v, "Couleur") === selectedColor,
  );

  const stockInCurrentStore =
    matchingVariant && selectedStore
      ? (matchingVariant.stockByStore[selectedStore.id] ?? 0)
      : null;

  const otherStoreWithStock =
    matchingVariant && selectedStore
      ? stores.find(
          (s) =>
            s.id !== selectedStore.id &&
            (matchingVariant.stockByStore[s.id] ?? 0) > 0,
        )
      : null;

  const isOutOfStock =
    stockInCurrentStore !== null && stockInCurrentStore === 0;
  const canAddToCart = matchingVariant && selectedStore && !isOutOfStock;

  const cartItem = matchingVariant
    ? items.find((i) => i.productVariantId === matchingVariant.id)
    : undefined;
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!canAddToCart || !matchingVariant) return;
    addItem({
      productId: product.id,
      productVariantId: matchingVariant.id,
      productName: product.name,
      imageUrl: product.images[0]?.url ?? "",
      price: product.price,
      size: selectedSize ?? "",
      color: selectedColor ?? "",
      quantity: 1,
      maxStock: stockInCurrentStore ?? 0,
    });
  };

  const handleIncrease = () => {
    if (!matchingVariant || !selectedSize || !selectedColor) return;
    updateQuantity(product.id, selectedSize, selectedColor, quantityInCart + 1);
  };

  const handleDecrease = () => {
    if (!matchingVariant || !selectedSize || !selectedColor) return;
    if (quantityInCart <= 1) {
      removeItem(product.id, selectedSize, selectedColor);
    } else {
      updateQuantity(
        product.id,
        selectedSize,
        selectedColor,
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
        {category && (
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate(`/shop?category=${category.slug}`)}
            underline="hover"
            color="text.secondary"
          >
            {category.name}
          </Link>
        )}
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
            src={product.images[selectedImageIndex]?.url}
            alt={product.images[selectedImageIndex]?.altText ?? product.name}
            sx={{
              width: "100%",
              height: isDesktop ? 480 : 320,
              objectFit: "cover",
              borderRadius: 1,
              mb: 1,
            }}
          />
          {product.images.length > 1 && (
            <Stack direction="row" spacing={1}>
              {product.images.map((img, index) => (
                <Box
                  key={img.id}
                  component="img"
                  src={img.url}
                  alt={img.altText ?? product.name}
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
          )}
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

          {availableSizes.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Taille
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap" }}
              >
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
            </>
          )}

          {availableColors.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Couleur / Finition
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap" }}
              >
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
            </>
          )}

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
              <IconButton
                aria-label="Retirer un exemplaire"
                onClick={handleDecrease}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {quantityInCart}
              </Typography>
              <IconButton
                aria-label="Ajouter un exemplaire"
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
