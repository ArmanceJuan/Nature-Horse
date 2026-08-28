import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlaceIcon from "@mui/icons-material/Place";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ShopMenu } from "./ShopMenu.js";
import { useCart } from "../../../features/cart/context/CartContext.js";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const navItems = [
    { label: "Accueil", path: "/", icon: <HomeIcon /> },
    { label: "Boutique", path: "/shop", icon: <StorefrontIcon /> },
    {
      label: "Panier",
      path: "/cart",
      icon: (
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon />
        </Badge>
      ),
    },
    { label: "Boutiques", path: "/stores", icon: <PlaceIcon /> },
    { label: "Admin", path: "/admin", icon: <DashboardIcon /> },
  ];

  const currentIndex = navItems.findIndex(
    (item) => item.path === location.pathname,
  );

  const handleChange = (newValue: number) => {
    if (navItems[newValue].path === "/shop") {
      setIsShopMenuOpen(true);
    } else {
      navigate(navItems[newValue].path);
    }
  };

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={currentIndex === -1 ? 0 : currentIndex}
          onChange={(_, newValue) => handleChange(newValue)}
          showLabels
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>

      <ShopMenu
        open={isShopMenuOpen}
        onClose={() => setIsShopMenuOpen(false)}
      />
    </>
  );
};
