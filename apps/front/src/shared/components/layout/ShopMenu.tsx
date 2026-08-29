import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ShopMenuProps {
  open: boolean;
  onClose: () => void;
}

const SHOP_CATEGORIES = [
  { label: "Voir tout", slug: null },
  { label: "Cavalier", slug: "cavalier" },
  { label: "Cheval", slug: "cheval" },
  { label: "Écurie", slug: "ecurie" },
  { label: "Soin", slug: "soin" },
  { label: "Chiens Chats", slug: "chiens-chats" },
  { label: "Promotions", slug: "promotions" },
  { label: "Nouveauté", slug: "nouveaute" },
];

export const ShopMenu = ({ open, onClose }: ShopMenuProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSelect = (slug: string | null) => {
    navigate(slug ? `/shop?category=${slug}` : "/shop");
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { bgcolor: theme.palette.background.paper } } }}
    >
      <List>
        {SHOP_CATEGORIES.map((category) => (
          <ListItemButton
            key={category.label}
            onClick={() => handleSelect(category.slug)}
          >
            <ListItemText primary={category.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
