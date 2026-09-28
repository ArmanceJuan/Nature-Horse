import { useState } from "react";
import type { ReactNode } from "react";
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
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ShopMenu } from "./ShopMenu.js";
import { useCart } from "../../../features/cart/context/CartContext.js";
import { useAuth } from "../../../features/auth/context/AuthContext.js";

interface NavItem {
  label: string;
  path: string;
  isActive: (pathname: string) => boolean;
  icon: ReactNode;
}

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      label: "Accueil",
      path: "/",
      isActive: (pathname) => pathname === "/",
      icon: <HomeIcon />,
    },
    {
      label: "Boutique",
      path: "/shop",
      isActive: (pathname) => pathname === "/shop",
      icon: <StorefrontIcon />,
    },
    {
      label: "Panier",
      path: "/cart",
      isActive: (pathname) => pathname === "/cart",
      icon: (
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon />
        </Badge>
      ),
    },
    {
      label: "Boutiques",
      path: "/stores",
      isActive: (pathname) => pathname === "/stores",
      icon: <PlaceIcon />,
    },
    {
      label: "Compte",
      path: user ? "/account" : "/login",
      isActive: (pathname) =>
        ["/account", "/login", "/register"].includes(pathname),
      icon: <PersonOutlinedIcon />,
    },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({
      label: "Admin",
      path: "/admin",
      isActive: (pathname) => pathname.startsWith("/admin"),
      icon: <DashboardIcon />,
    });
  }

  const isCompact = navItems.length > 5;

  const currentIndex = navItems.findIndex((item) =>
    item.isActive(location.pathname),
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
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background.paper",
        }}
        elevation={3}
      >
        <BottomNavigation
          value={currentIndex === -1 ? 0 : currentIndex}
          onChange={(_, newValue) => handleChange(newValue)}
          showLabels
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
              sx={
                isCompact
                  ? {
                      minWidth: 0,
                      px: 0.5,
                      "& .MuiBottomNavigationAction-label": {
                        fontSize: "0.68rem",
                      },
                    }
                  : undefined
              }
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
