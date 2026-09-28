import { Box, CircularProgress, Typography } from "@mui/material";
import { StoreCard } from "../components/StoreCard.js";
import { useStore } from "../context/StoreContext.js";

export const StoresPage = () => {
  const { stores, selectedStore, setSelectedStore, isLoading } = useStore();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" sx={{ fontSize: "1.8rem", mb: 1 }}>
          Nos Boutiques
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 560, mx: "auto" }}
        >
          Retrouvez nos adresses et horaires, et choisissez la boutique dans
          laquelle vous souhaitez retirer vos commandes.
        </Typography>
      </Box>

      {stores.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Impossible de charger les boutiques pour le moment.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {stores.map((store) => (
            <Box key={store.id} sx={{ flex: "1 1 320px", maxWidth: 560 }}>
              <StoreCard
                store={store}
                isSelected={selectedStore?.id === store.id}
                onSelect={() => setSelectedStore(store)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
