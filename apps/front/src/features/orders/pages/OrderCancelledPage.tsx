import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export const OrderCancelledPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <Box sx={{ p: 2, maxWidth: 560, mx: "auto", mt: 4 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
        }}
      >
        <CancelOutlinedIcon
          sx={{ fontSize: 56, color: "text.secondary", mb: 1 }}
        />
        <Typography variant="h4" sx={{ fontSize: "1.4rem", mb: 1 }}>
          Paiement annulé
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Votre commande n'a pas été validée et les articles ont été remis en
          stock. Vous pouvez reprendre votre panier ou réessayer.
        </Typography>
        <Button variant="contained" fullWidth onClick={() => navigate("/cart")}>
          Retour au panier
        </Button>
        {token && (
          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate(`/track/${token}`)}
          >
            Voir le détail
          </Button>
        )}
      </Paper>
    </Box>
  );
};
