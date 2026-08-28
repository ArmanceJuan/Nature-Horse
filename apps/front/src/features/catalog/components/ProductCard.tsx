import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.types.js";

interface ProductCardProps {
  product: Product;
  fullWidth?: boolean;
}

export const ProductCard = ({ product, fullWidth }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{ width: fullWidth ? "100%" : 160, flexShrink: 0, cursor: "pointer" }}
      elevation={0}
    >
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        sx={{ height: 160, borderRadius: 1 }}
      />
      <CardContent sx={{ px: 0, pb: 0 }}>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5em",
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {product.price} €
        </Typography>
      </CardContent>
    </Card>
  );
};
