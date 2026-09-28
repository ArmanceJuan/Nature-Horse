import { Button, Paper, Stack, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { Store } from "../types/store.types.js";

interface StoreCardProps {
  store: Store;
  isSelected: boolean;
  onSelect: () => void;
}

export const StoreCard = ({ store, isSelected, onSelect }: StoreCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "2px solid",
        borderColor: isSelected ? "primary.main" : "rgba(0,0,0,0.1)",
        borderRadius: 1,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontSize: "1.4rem" }}>
        {store.city}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <PlaceIcon fontSize="small" />
        <Typography variant="body2">
          {store.address}, {store.postalCode} {store.city}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <AccessTimeIcon fontSize="small" />
        <Stack>
          {store.openingHours.map((line) => (
            <Typography key={line} variant="body2">
              {line}
            </Typography>
          ))}
        </Stack>
      </Stack>

      {store.phone && (
        <Typography variant="body2">Téléphone : {store.phone}</Typography>
      )}

      <Button
        variant={isSelected ? "outlined" : "contained"}
        disabled={isSelected}
        onClick={onSelect}
        sx={{ mt: "auto" }}
      >
        {isSelected ? "Ma boutique" : "Choisir cette boutique"}
      </Button>
    </Paper>
  );
};
