import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Chip,
  Button,
  Drawer,
} from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import FilterListIcon from "@mui/icons-material/FilterList";
import { mockProducts } from "../data/mockProducts.js";
import { ProductCard } from "../components/ProductCard.js";
import { SearchBar } from "../../../shared/components/layout/SearchBar.js";
import { CatalogFilters } from "../components/CatalogFilters.js";
import { useIsDesktop } from "../../../shared/hooks/useIsDesktop.js";
import type { FiltersState } from "../components/CatalogFilters.js";
type ViewMode = "grid" | "list";

const EMPTY_FILTERS: FiltersState = {
  disciplines: [],
  sizes: [],
  minPrice: "",
  maxPrice: "",
};

export const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const collectionFilter = searchParams.get("collection");
  const searchQuery = searchParams.get("search");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const availableSizes = [
    ...new Set(mockProducts.flatMap((p) => p.variants.map((v) => v.size))),
  ];

  const filteredProducts = mockProducts.filter((p) => {
    const matchesCollection = collectionFilter
      ? p.collection === collectionFilter
      : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesDiscipline =
      filters.disciplines.length > 0
        ? filters.disciplines.includes(p.discipline)
        : true;
    const matchesSize =
      filters.sizes.length > 0
        ? p.variants.some((v) => filters.sizes.includes(v.size))
        : true;
    const matchesMinPrice = filters.minPrice
      ? p.price >= Number(filters.minPrice)
      : true;
    const matchesMaxPrice = filters.maxPrice
      ? p.price <= Number(filters.maxPrice)
      : true;
    return (
      matchesCollection &&
      matchesSearch &&
      matchesDiscipline &&
      matchesSize &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const activeFilterChips = [
    ...filters.disciplines.map((d) => ({
      label: d,
      onDelete: () =>
        setFilters({
          ...filters,
          disciplines: filters.disciplines.filter((x) => x !== d),
        }),
    })),
    ...filters.sizes.map((s) => ({
      label: `Taille: ${s}`,
      onDelete: () =>
        setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    })),
  ];

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <Box sx={{ pt: 2, px: 2 }}>
      {!isDesktop && (
        <Box sx={{ mb: 2 }}>
          <SearchBar />
        </Box>
      )}

      <Typography variant="h4" sx={{ fontSize: "1.5rem", mb: 0.5 }}>
        Boutique
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Découvrez notre collection raffinée d'équipements pour le cavalier
        exigeant.
      </Typography>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {isDesktop && (
          <Box sx={{ width: 220, flexShrink: 0 }}>
            <CatalogFilters
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
              availableSizes={availableSizes}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", alignItems: "center" }}
            >
              {!isDesktop && (
                <Button
                  size="small"
                  startIcon={<FilterListIcon />}
                  variant="outlined"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  sx={{ textTransform: "none" }}
                >
                  Filtres
                </Button>
              )}
              {activeFilterChips.map((chip) => (
                <Chip
                  key={chip.label}
                  label={chip.label}
                  onDelete={chip.onDelete}
                  size="small"
                />
              ))}
              {activeFilterChips.length > 0 && (
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={clearFilters}
                >
                  Tout effacer
                </Typography>
              )}
            </Stack>

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

          {filteredProducts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              Aucun produit trouvé.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    flex: viewMode === "grid" ? "1 1 160px" : "1 1 100%",
                    maxWidth: viewMode === "grid" ? 240 : "100%",
                  }}
                >
                  <ProductCard
                    product={product}
                    fullWidth={viewMode === "list"}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <Box sx={{ p: 2, maxHeight: "80vh", overflowY: "auto" }}>
          <CatalogFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            availableSizes={availableSizes}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setIsFilterDrawerOpen(false)}
          >
            Voir les résultats
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};
