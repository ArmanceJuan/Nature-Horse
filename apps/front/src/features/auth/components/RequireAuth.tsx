import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext.js";
import type { UserRole } from "../types/auth.types.js";

type AccessState = "loading" | "granted" | "unauthenticated" | "forbidden";

interface RequireAuthProps {
  children: ReactNode;
  role?: UserRole;
}

export const RequireAuth = ({ children, role }: RequireAuthProps) => {
  const { refresh } = useAuth();
  const [access, setAccess] = useState<AccessState>("loading");

  useEffect(() => {
    let isCancelled = false;

    refresh().then((currentUser) => {
      if (isCancelled) return;

      if (currentUser === null) {
        setAccess("unauthenticated");
      } else if (role !== undefined && currentUser.role !== role) {
        setAccess("forbidden");
      } else {
        setAccess("granted");
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [refresh, role]);

  if (access === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (access === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (access === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
