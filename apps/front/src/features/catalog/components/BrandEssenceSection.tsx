import { Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BrandEssenceSection = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={4} sx={{ px: 2, py: 5, alignItems: "center" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h2" sx={{ fontSize: "1.6rem", mb: 2 }}>
          L'Essence de Nature Horse
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Depuis plus d'un siècle, nous cultivons la passion de l'équitation
          avec une exigence absolue. Chaque pièce est conçue comme un hommage à
          la noblesse du cheval et à l'art de monter.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Notre philosophie repose sur un équilibre subtil : préserver les
          techniques traditionnelles tout en intégrant des innovations
          techniques pour offrir un confort et une performance inégalés.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 600,
          }}
          onClick={() => navigate("/stores")}
        >
          Notre héritage →
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800"
          alt="Savoir-faire Nature Horse"
          sx={{
            width: "100%",
            height: { xs: 280, md: 360 },
            objectFit: "cover",
            borderRadius: 1,
          }}
        />
      </Grid>
    </Grid>
  );
};
