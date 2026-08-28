import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { authApi } from "../api/authApi.js";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await authApi.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", mb: 3 }}>
        Créer un compte
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Prénom"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            required
            fullWidth
          />
          <TextField
            label="Nom"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            required
            fullWidth
          />
          <Button type="submit" variant="contained">
            S'inscrire
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
