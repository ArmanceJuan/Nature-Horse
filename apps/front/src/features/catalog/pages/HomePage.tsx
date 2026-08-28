import { Box, Stack } from "@mui/material";
import { mockCollections } from "../data/mockCollections.js";
import { mockProducts } from "../data/mockProducts.js";
import { CollectionBlock } from "../components/CollectionBlock.js";
import { ProductCarousel } from "../components/ProductCarousel.js";

export const HomePage = () => {
  const popularProducts = mockProducts.filter((p) => p.isPopular);
  const newProducts = mockProducts.filter((p) => p.isNew);

  return (
    <Box sx={{ pt: 2 }}>
      <Stack spacing={1.5} sx={{ px: 2 }}>
        {mockCollections.map((collection) => (
          <CollectionBlock key={collection.id} collection={collection} />
        ))}
      </Stack>

      <ProductCarousel title="Populaires" products={popularProducts} />
      <ProductCarousel title="Nouveautés" products={newProducts} />
    </Box>
  );
};
