import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useStore } from "../../../features/stores/context/StoreContext.js";

export const Header = () => {
  const { selectedStore, openSelector } = useStore();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ fontSize: "1.25rem" }}>
          Nature Horse
        </Typography>
        <Button
          size="small"
          startIcon={<PlaceIcon />}
          onClick={() => {
            openSelector();
          }}
          sx={{ textTransform: "none" }}
        >
          {selectedStore?.city}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
