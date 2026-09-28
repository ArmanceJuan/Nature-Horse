import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { otpApi } from "../../auth/api/otpApi.js";
import { useAuth } from "../../auth/context/AuthContext.js";

export const TwoFactorSection = () => {
  const { user, refresh } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const isEnabled = user?.otpEnabled === true || backupCodes !== null;

  const cancelSetup = () => {
    setQrCode(null);
    setSecret(null);
    setCode("");
    setError(null);
  };

  const startSetup = async () => {
    setError(null);
    setIsBusy(true);

    try {
      const result = await otpApi.generateSecret();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de générer le code QR.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const confirmSetup = async (event: FormEvent) => {
    event.preventDefault();
    if (!secret) return;

    setError(null);
    setIsBusy(true);

    try {
      const result = await otpApi.enable(secret, code.trim());
      setBackupCodes(result.backupCodes);
      setQrCode(null);
      setSecret(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code invalide.");
    } finally {
      setIsBusy(false);
    }
  };

  const finishSetup = async () => {
    await refresh();
    setBackupCodes(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}
      >
        <Typography variant="h4" sx={{ fontSize: "1.1rem" }}>
          Double authentification
        </Typography>
        <Chip
          size="small"
          label={isEnabled ? "Activée" : "Désactivée"}
          color={isEnabled ? "success" : "default"}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Un code temporaire, généré par votre téléphone, s'ajoute à votre mot de
        passe à chaque connexion.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {backupCodes ? (
        <Stack spacing={2}>
          <Alert severity="success">
            Double authentification activée. Notez ces codes de secours en lieu
            sûr : ils ne seront plus jamais affichés.
          </Alert>
          <List dense>
            {backupCodes.map((backupCode) => (
              <ListItem key={backupCode} sx={{ fontFamily: "monospace" }}>
                {backupCode}
              </ListItem>
            ))}
          </List>
          <Box>
            <Button variant="contained" onClick={finishSetup}>
              J'ai enregistré mes codes
            </Button>
          </Box>
        </Stack>
      ) : isEnabled ? (
        <Typography variant="body2">
          Votre compte est protégé : un code vous sera demandé à chaque
          connexion.
        </Typography>
      ) : qrCode ? (
        <Stack spacing={2}>
          <Typography variant="body2">
            Scannez ce QR code avec votre application d'authentification (Google
            Authenticator, Authy...), puis saisissez le code affiché.
          </Typography>
          <Box
            component="img"
            src={qrCode}
            alt="QR code de double authentification"
            sx={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <form onSubmit={confirmSetup}>
            <Stack spacing={2}>
              <TextField
                label="Code de vérification"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                fullWidth
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    autoComplete: "one-time-code",
                  },
                }}
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" disabled={isBusy}>
                  Activer
                </Button>
                <Button onClick={cancelSetup} disabled={isBusy}>
                  Annuler
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      ) : (
        <Box>
          <Button variant="contained" onClick={startSetup} disabled={isBusy}>
            Activer la double authentification
          </Button>
        </Box>
      )}
    </Paper>
  );
};
