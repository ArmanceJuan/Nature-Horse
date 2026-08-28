import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
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
        <Typography variant="body2" sx={{ mb: 2 }}>
          Sélectionnez la boutique dont vous souhaitez voir les produits et la
          disponibilité.
        </Typography>
        <List>
          {stores.map((store) => (
            <ListItemButton
              key={store.id}
              onClick={() => setSelectedStore(store)}
            >
              <ListItemText primary={store.city} secondary={store.address} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
