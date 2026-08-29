import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Badge,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlaceIcon from "@mui/icons-material/Place";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useCart } from "../../../features/cart/context/CartContext.js";
import { useStore } from "../../../features/stores/context/StoreContext.js";
import { SHOP_CATEGORIES } from "../../../features/catalog/data/categories.js";
import { SearchBar } from "./SearchBar.js";

export const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { selectedStore, openSelector } = useStore();

  const navCategories = SHOP_CATEGORIES.filter((c) => c.slug !== null);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontSize: "1.4rem", cursor: "pointer", whiteSpace: "nowrap" }}
          onClick={() => navigate("/")}
        >
          Nature Horse
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            size="small"
            startIcon={<PlaceIcon />}
            onClick={openSelector}
            sx={{
              textTransform: "none",
              color: "text.primary",
              whiteSpace: "nowrap",
            }}
          >
            {selectedStore?.city}
          </Button>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={totalItems} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton onClick={() => navigate("/login")}>
            <PersonOutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>

      <Stack
        direction="row"
        useFlexGap
        sx={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
          columnGap: { xs: 2, md: 3, lg: 4 },
          rowGap: 0.5,
          px: 3,
          pb: 1.5,
        }}
      >
        {navCategories.map((category) => (
          <Button
            key={category.slug}
            disableRipple
            sx={{
              color: "text.primary",
              textTransform: "none",
              whiteSpace: "nowrap",
              fontSize: "1rem",
              fontWeight: location.search.includes(`category=${category.slug}`)
                ? 700
                : 400,
              minWidth: 0,
              p: 0,
              "&:first-of-type": { ml: 0 },
            }}
            onClick={() => navigate(`/shop?category=${category.slug}`)}
          >
            {category.label}
          </Button>
        ))}
      </Stack>

      <Box sx={{ px: 3, pb: 1.5, width: "100%" }}>
        <SearchBar />
      </Box>
    </AppBar>
  );
};
