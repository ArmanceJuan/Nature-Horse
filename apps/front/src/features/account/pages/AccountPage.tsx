import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/context/AuthContext.js";
import type { UserRole } from "../../auth/types/auth.types.js";
import { TwoFactorSection } from "../components/TwoFactorSection.js";
import { OrderHistorySection } from "../../orders/components/OrderHistorySection.js";

const ROLE_LABELS: Record<UserRole, string | null> = {
  ADMIN: "Admin",
  STAFF: "Vendeur",
  CLIENT: null,
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={{ xs: 0, sm: 2 }}
    sx={{ py: 1 }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ width: { sm: 160 }, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Stack>
);

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleLabel = ROLE_LABELS[user.role];
  const canUseTwoFactor = user.role === "ADMIN" || user.role === "STAFF";
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box sx={{ p: 2, maxWidth: 720, mx: "auto" }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
          Mon compte
        </Typography>
        {roleLabel && <Chip label={roleLabel} color="primary" size="small" />}
      </Stack>

      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
        >
          <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 1 }}>
            Mes informations
          </Typography>
          <InfoRow label="Prénom" value={user.firstName} />
          <InfoRow label="Nom" value={user.lastName} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Téléphone" value={user.phone ?? "Non renseigné"} />
          <InfoRow label="Membre depuis le" value={memberSince} />
        </Paper>

        <OrderHistorySection />

        {canUseTwoFactor && <TwoFactorSection />}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {user.role === "ADMIN" && (
            <Button variant="contained" onClick={() => navigate("/admin")}>
              Espace administration
            </Button>
          )}
          <Button variant="outlined" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
