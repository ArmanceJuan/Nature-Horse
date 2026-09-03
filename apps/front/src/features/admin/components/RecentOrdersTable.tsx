import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import type { RecentOrder } from "../types/admin.types.js";

const STATUS_COLORS: Record<
  RecentOrder["status"],
  "success" | "warning" | "error" | "info"
> = {
  Expédié: "success",
  "En cours": "warning",
  Annulé: "error",
  Livré: "info",
};

export const RecentOrdersTable = ({ orders }: { orders: RecentOrder[] }) => {
  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 1, p: 2.5 }}
    >
      <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 2 }}>
        Dernières Commandes
      </Typography>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                N° CMD
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                CLIENT
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                DATE
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                STATUT
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
              >
                TOTAL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "0.75rem",
                        bgcolor: "text.primary",
                      }}
                    >
                      {order.initials}
                    </Avatar>
                    <Typography variant="body2">{order.client}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {order.date}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={STATUS_COLORS[order.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {order.total.toFixed(2)} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
