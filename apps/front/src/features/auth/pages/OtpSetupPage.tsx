import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Box,
  List,
  ListItem,
} from "@mui/material";
import { otpApi } from "../api/otpApi.js";
import { authApi } from "../api/authApi.js";

export const OtpSetupPage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      const result = await otpApi.generateSecret();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate secret",
      );
    }
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!secret) return;

    try {
      const result = await otpApi.enable(secret, code);
      setBackupCodes(result.backupCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable OTP");
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleLogout}
        sx={{ mb: 2 }}
      >
        Se déconnecter
      </Button>

      <Typography variant="h1" sx={{ fontSize: "2rem", mb: 3 }}>
        Activer la double authentification
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {backupCodes ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            2FA activée avec succès ! Notez ces codes de secours en lieu sûr,
            ils ne seront plus jamais affichés.
          </Alert>
          <List>
            {backupCodes.map((c) => (
              <ListItem key={c} sx={{ fontFamily: "monospace" }}>
                {c}
              </ListItem>
            ))}
          </List>
        </>
      ) : qrCode ? (
        <Stack spacing={2}>
          <Typography variant="body1">
            Scannez ce QR code avec votre application d'authentification (Google
            Authenticator, Authy...), puis entrez le code généré.
          </Typography>
          <Box
            component="img"
            src={qrCode}
            alt="QR code OTP"
            sx={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <form onSubmit={handleEnable}>
            <Stack spacing={2}>
              <TextField
                label="Code de vérification"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained">
                Activer
              </Button>
            </Stack>
          </form>
        </Stack>
      ) : (
        <Button variant="contained" onClick={handleGenerate}>
          Générer un QR code
        </Button>
      )}
    </Container>
  );
};
