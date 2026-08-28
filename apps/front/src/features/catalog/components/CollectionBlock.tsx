import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Collection } from "../types/product.types.js";

interface CollectionBlockProps {
  collection: Collection;
}

export const CollectionBlock = ({ collection }: CollectionBlockProps) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/shop?collection=${collection.id}`)}
      sx={{
        position: "relative",
        height: 180,
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
        backgroundImage: `url(${collection.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
        }}
      />
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          bottom: 12,
          left: 16,
          color: "white",
          fontSize: "1.1rem",
        }}
      >
        {collection.name}
      </Typography>
    </Box>
  );
};
