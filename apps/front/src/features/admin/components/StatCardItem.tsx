import { Paper, Typography, Stack } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import type { StatCard } from "../types/admin.types.js";

const ICONS = {
  revenue: PaidOutlinedIcon,
  orders: ShoppingBagOutlinedIcon,
  basket: ShoppingCartOutlinedIcon,
  customers: GroupOutlinedIcon,
};

export const StatCardItem = ({ stat }: { stat: StatCard }) => {
  const Icon = ICONS[stat.icon];
  const isPositive = stat.variation >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 1,
        p: 2.5,
        flex: 1,
        minWidth: 200,
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography
          variant="body2"
          sx={{
            textTransform: "uppercase",
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {stat.label}
        </Typography>
        <Icon fontSize="small" sx={{ color: "text.secondary" }} />
      </Stack>
      <Typography variant="h4" sx={{ fontSize: "1.8rem", mb: 1 }}>
        {stat.value}
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        {isPositive ? (
          <TrendingUpIcon fontSize="small" sx={{ color: "success.main" }} />
        ) : (
          <TrendingDownIcon fontSize="small" sx={{ color: "error.main" }} />
        )}
        <Typography
          variant="body2"
          sx={{
            color: isPositive ? "success.main" : "error.main",
            fontWeight: 600,
          }}
        >
          {isPositive ? "+" : ""}
          {stat.variation}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          vs période préc.
        </Typography>
      </Stack>
    </Paper>
  );
};
