import { Box, Typography, LinearProgress, Stack } from "@mui/material";
import type { StockAlert } from "../types/admin.types.js";

const STATUS_COLORS: Record<
  StockAlert["status"],
  "warning" | "success" | "primary"
> = {
  "Stock Faible": "warning",
  Optimal: "success",
  Normal: "primary",
};

export const StockAlertItem = ({ alert }: { alert: StockAlert }) => {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          {alert.category}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: `${STATUS_COLORS[alert.status]}.main`, fontWeight: 600 }}
        >
          {alert.status}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5, fontSize: "0.8rem" }}
      >
        {alert.subtitle}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={alert.level}
        color={STATUS_COLORS[alert.status]}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Box>
  );
};
