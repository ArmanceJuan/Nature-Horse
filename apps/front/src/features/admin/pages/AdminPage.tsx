import { Box, Typography, Stack, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import {
  mockStats,
  mockRecentOrders,
  mockStockAlerts,
} from "../data/mockAdminData.js";
import { StatCardItem } from "../components/StatCardItem.js";
import { RecentOrdersTable } from "../components/RecentOrdersTable.js";
import { StockAlertItem } from "../components/StockAlertItem.js";
import { useIsDesktop } from "../../../shared/hooks/useIsDesktop.js";

export const AdminPage = () => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
            Vue d'ensemble
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Résumé des performances de la boutique.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/admin/products/new")}
          >
            Ajouter un produit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none" }}
          >
            Rapport
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {mockStats.map((stat) => (
          <StatCardItem key={stat.label} stat={stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isDesktop ? "row" : "column",
        }}
      >
        <Box sx={{ flex: isDesktop ? 2 : 1 }}>
          <RecentOrdersTable orders={mockRecentOrders} />
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 1,
            p: 2.5,
            flex: 1,
          }}
        >
          <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 0.5 }}>
            État des Stocks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Alerte inventaire par catégorie
          </Typography>
          {mockStockAlerts.map((alert) => (
            <StockAlertItem key={alert.category} alert={alert} />
          ))}
          <Button
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", mt: 1 }}
          >
            Gérer l'inventaire
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
