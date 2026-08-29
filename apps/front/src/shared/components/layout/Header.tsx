import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavDrawer } from "./NavDrawer.js";
import { useCart } from "../../../features/cart/context/CartContext.js";

export const Header = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={() => setIsDrawerOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h4"
            sx={{ fontSize: "1.25rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Nature Horse
          </Typography>

          <div>
            <IconButton onClick={() => navigate("/shop")}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => navigate("/cart")}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <NavDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
