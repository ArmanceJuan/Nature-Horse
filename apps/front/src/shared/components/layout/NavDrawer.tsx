import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SHOP_CATEGORIES } from "../../../features/catalog/data/categories.js";
import { useStore } from "../../../features/stores/context/StoreContext.js";
import PlaceIcon from "@mui/icons-material/Place";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavDrawer = ({ open, onClose }: NavDrawerProps) => {
  const navigate = useNavigate();
  const { selectedStore, openSelector } = useStore();

  const handleCategoryClick = (slug: string | null) => {
    navigate(slug ? `/shop?category=${slug}` : "/shop");
    onClose();
  };

  const handleStoreClick = () => {
    onClose();
    openSelector();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }} role="presentation">
        <Typography variant="h4" sx={{ fontSize: "1.3rem", p: 2 }}>
          Nature Horse
        </Typography>
        <Divider />
        <List>
          {SHOP_CATEGORIES.map((category) => (
            <ListItemButton
              key={category.label}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <ListItemText primary={category.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={handleStoreClick}>
            <PlaceIcon sx={{ mr: 1.5, fontSize: 20 }} />
            <ListItemText
              primary={selectedStore?.city ?? "Choisir une boutique"}
            />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};
