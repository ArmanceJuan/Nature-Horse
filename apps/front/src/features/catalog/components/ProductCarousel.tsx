import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.types.js";
import { ProductCard } from "./ProductCard.js";

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 3 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          mb: 1,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: "1.1rem" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/shop")}
        >
          Voir tout
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ overflowX: "auto", px: 2, pb: 1 }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} fixedWidth={160} />
        ))}
      </Stack>
    </Box>
  );
};
