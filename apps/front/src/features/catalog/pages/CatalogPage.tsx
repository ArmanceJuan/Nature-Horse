import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import { mockProducts } from "../data/mockProducts.js";
import { ProductCard } from "../components/ProductCard.js";

type ViewMode = "grid" | "list";

export const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const collectionFilter = searchParams.get("collection");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredProducts = collectionFilter
    ? mockProducts.filter((p) => p.collection === collectionFilter)
    : mockProducts;

  return (
    <Box sx={{ pt: 2, px: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography variant="h4" sx={{ fontSize: "1.25rem" }}>
          Boutique
        </Typography>
        <Stack direction="row">
          <IconButton
            onClick={() => setViewMode("list")}
            color={viewMode === "list" ? "primary" : "default"}
          >
            <ViewAgendaIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode("grid")}
            color={viewMode === "grid" ? "primary" : "default"}
          >
            <ViewModuleIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid key={product.id} size={viewMode === "grid" ? 6 : 12}>
            <ProductCard product={product} fullWidth={viewMode === "list"} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
