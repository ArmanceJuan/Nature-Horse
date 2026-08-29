import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product.types.js";

interface ProductCardProps {
  product: Product;
  fullWidth?: boolean;
  fixedWidth?: number;
}

export const ProductCard = ({
  product,
  fullWidth,
  fixedWidth,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{
        width: fixedWidth ? fixedWidth : "100%",
        flexShrink: 0,
        cursor: "pointer",
      }}
      elevation={0}
    >
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        sx={{
          height: fixedWidth ? fixedWidth : { xs: 160, md: 260 },
          borderRadius: 1,
        }}
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
