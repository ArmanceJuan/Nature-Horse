import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../features/stores/context/StoreContext.js";
import { useCategories } from "../../../features/catalog/hooks/useCategories.js";
import {
  ALL_PRODUCTS_ITEM,
  NEW_PRODUCTS_ITEM,
  buildCategoryItems,
} from "../../../features/catalog/utils/shop-nav.js";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavDrawer = ({ open, onClose }: NavDrawerProps) => {
  const navigate = useNavigate();
  const { selectedStore, openSelector } = useStore();
  const { categories } = useCategories();

  const items = [
    ALL_PRODUCTS_ITEM,
    ...buildCategoryItems(categories),
    NEW_PRODUCTS_ITEM,
  ];

  const handleItemClick = (to: string) => {
    navigate(to);
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
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              onClick={() => handleItemClick(item.to)}
            >
              <ListItemText primary={item.label} />
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
