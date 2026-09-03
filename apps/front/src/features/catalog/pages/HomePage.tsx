import { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../api/productsApi.js";
import type { Product } from "../types/product.types.js";
import { ProductCarousel } from "../components/ProductCarousel.js";
import { HeroBanner } from "../components/HeroBanner.js";
import { PromoBlock } from "../components/PromoBlock.js";
import { BrandEssenceSection } from "../components/BrandEssenceSection.js";

export const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result: Product[] = await productsApi.getAll({ limit: 50 });
        setProducts(result);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const popularProducts = products.filter((p) => p.isPopular);
  const newProducts = products.filter((p) => p.isNew);

  return (
    <Box>
      <HeroBanner />

      <ProductCarousel title="Articles Populaires" products={popularProducts} />

      <Grid container spacing={2} sx={{ px: 2, mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PromoBlock
            title="Collection Hiver"
            subtitle="Performance et chaleur pour la saison."
            buttonLabel="Explorer"
            imageUrl="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700"
            onClick={() => navigate("/shop?collection=textile-performance")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PromoBlock
            title="Accessoires de Soin"
            subtitle="L'excellence au quotidien."
            buttonLabel="Découvrir"
            imageUrl="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=700"
            onClick={() => navigate("/shop?category=soin")}
          />
        </Grid>
      </Grid>

      <BrandEssenceSection />

      <ProductCarousel title="Nouveautés" products={newProducts} />
    </Box>
  );
};
