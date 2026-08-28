import { Box, Typography, Stack } from "@mui/material";
import type { Product } from "../types/product.types.js";
import { ProductCard } from "./ProductCard.js";

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ fontSize: "1.1rem", px: 2, mb: 1 }}>
        {title}
      </Typography>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ overflowX: "auto", px: 2, pb: 1 }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Stack>
    </Box>
  );
};
