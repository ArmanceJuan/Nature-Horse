import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Stack,
  ToggleButton,
} from "@mui/material";
import type { Discipline } from "../types/product.types.js";

export interface FiltersState {
  disciplines: Discipline[];
  sizes: string[];
  minPrice: string;
  maxPrice: string;
}

interface CatalogFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  onClear: () => void;
  availableSizes: string[];
}

const DISCIPLINES: { value: Discipline; label: string }[] = [
  { value: "dressage", label: "Dressage" },
  { value: "obstacle", label: "Saut d'obstacles" },
  { value: "complet", label: "Complet" },
  { value: "loisir", label: "Loisir" },
];

export const CatalogFilters = ({
  filters,
  onChange,
  onClear,
  availableSizes,
}: CatalogFiltersProps) => {
  const toggleDiscipline = (discipline: Discipline) => {
    const isActive = filters.disciplines.includes(discipline);
    onChange({
      ...filters,
      disciplines: isActive
        ? filters.disciplines.filter((d) => d !== discipline)
        : [...filters.disciplines, discipline],
    });
  };

  const toggleSize = (size: string) => {
    const isActive = filters.sizes.includes(size);
    onChange({
      ...filters,
      sizes: isActive
        ? filters.sizes.filter((s) => s !== size)
        : [...filters.sizes, size],
    });
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Filtres
        </Typography>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={onClear}
        >
          Effacer
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Discipline
      </Typography>
      <Stack sx={{ mb: 3 }}>
        {DISCIPLINES.map((d) => (
          <FormControlLabel
            key={d.value}
            sx={{
              my: -0.5,
              "& .MuiFormControlLabel-label": { fontSize: "0.85rem" },
            }}
            control={
              <Checkbox
                size="small"
                checked={filters.disciplines.includes(d.value)}
                onChange={() => toggleDiscipline(d.value)}
              />
            }
            label={d.label}
          />
        ))}
      </Stack>

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Taille
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {availableSizes.map((size) => (
          <ToggleButton
            key={size}
            value={size}
            selected={filters.sizes.includes(size)}
            onClick={() => toggleSize(size)}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              border: "1px solid rgba(0,0,0,0.23)",
            }}
          >
            {size}
          </ToggleButton>
        ))}
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Prix
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Min €"
          value={filters.minPrice}
          onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
        />
        <TextField
          size="small"
          placeholder="Max €"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
        />
      </Stack>
    </Box>
  );
};
