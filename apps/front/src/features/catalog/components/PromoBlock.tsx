import { Box, Typography, Button } from "@mui/material";

interface PromoBlockProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
  imageUrl: string;
  onClick: () => void;
}

export const PromoBlock = ({
  title,
  subtitle,
  buttonLabel,
  imageUrl,
  onClick,
}: PromoBlockProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: 280,
        borderRadius: 1,
        overflow: "hidden",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />
      <Box sx={{ position: "relative", p: 2.5, color: "white" }}>
        <Typography variant="h4" sx={{ fontSize: "1.1rem", color: "white" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "white", mb: 1.5 }}>
          {subtitle}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "white",
            color: "text.primary",
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Box>
  );
};
