import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../../features/catalog/hooks/useCategories.js";
import {
  ALL_PRODUCTS_ITEM,
  NEW_PRODUCTS_ITEM,
  buildCategoryItems,
} from "../../../features/catalog/utils/shop-nav.js";

interface ShopMenuProps {
  open: boolean;
  onClose: () => void;
}

export const ShopMenu = ({ open, onClose }: ShopMenuProps) => {
  const navigate = useNavigate();
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

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#FAF7EA",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        },
      }}
    >
      <Box sx={{ pb: 2 }} role="presentation">
        <Typography variant="h4" sx={{ fontSize: "1.2rem", p: 2 }}>
          Boutique
        </Typography>
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
      </Box>
    </Drawer>
  );
};
