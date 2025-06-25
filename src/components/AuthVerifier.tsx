import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthVerifier = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {useEffect(() => {
        if (!isAuthenticated) {
          logout();
        }
      }, [])}
    </>
  );
};

export default AuthVerifier;
