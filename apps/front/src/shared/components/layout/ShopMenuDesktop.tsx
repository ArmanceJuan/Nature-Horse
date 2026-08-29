import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ShopMenuDesktopProps {
  anchorEl: HTMLElement | null;
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

export const ShopMenuDesktop = ({
  anchorEl,
  onClose,
}: ShopMenuDesktopProps) => {
  const navigate = useNavigate();

  const handleSelect = (slug: string | null) => {
    navigate(slug ? `/shop?category=${slug}` : "/shop");
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      disablePortal
    >
      {SHOP_CATEGORIES.map((category) => (
        <MenuItem
          key={category.label}
          onClick={() => handleSelect(category.slug)}
        >
          {category.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
