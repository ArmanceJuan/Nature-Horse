import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useStore } from "../context/StoreContext.js";

export const StoreSelectionModal = () => {
  const {
    selectedStore,
    setSelectedStore,
    stores,
    isSelectorOpen,
    closeSelector,
  } = useStore();

  const isMandatory = selectedStore === null;
  const isOpen = isMandatory || isSelectorOpen;

  const handleClose = (_event: object, reason: string) => {
    if (isMandatory) return;
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      closeSelector();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      disablePortal
    >
      <DialogTitle>Choisissez votre boutique</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {stores.map((store) => (
            <Box
              key={store.id}
              onClick={() => setSelectedStore(store)}
              sx={{
                position: "relative",
                height: 150,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                backgroundImage: `url(${store.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "1.1rem", color: "white" }}
                  >
                    {store.city}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {store.shortLabel}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "white",
                    color: "text.primary",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStore(store);
                  }}
                >
                  Découvrir
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
