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

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await authApi.login({
        email,
        password,
        code: requiresOtp ? code : undefined,
      });

      if (result.requiresOtp) {
        setRequiresOtp(true);
      } else {
        navigate("/otp-setup");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", mb: 3 }}>
        Connexion
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {!requiresOtp && (
            <>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </>
          )}

          {requiresOtp && (
            <TextField
              label="Code de vérification"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              fullWidth
              helperText="Entrez le code à 6 chiffres de votre application d'authentification"
            />
          )}

          <Button type="submit" variant="contained">
            {requiresOtp ? "Vérifier" : "Se connecter"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
