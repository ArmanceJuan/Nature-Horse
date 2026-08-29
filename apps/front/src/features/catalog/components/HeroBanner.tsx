import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        left: "50%",
        right: "50%",
        ml: "-50vw",
        mr: "-50vw",
        width: "100vw",
        height: { xs: 200, md: 275 },
        backgroundImage:
          "url(https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(0,0,0,0.45)",
          color: "white",
          p: { xs: 2, md: 3 },
          maxWidth: 420,
          ml: { xs: 2, md: 6 },
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.3rem", md: "1.7rem" },
            color: "white",
            mb: 1,
          }}
        >
          L'Élégance en Mouvement
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
          L'alliance parfaite entre l'héritage équestre et le raffinement
          contemporain.
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "white",
            color: "text.primary",
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
          onClick={() => navigate("/shop")}
        >
          Découvrir la collection
        </Button>
      </Box>
    </Box>
  );
};
