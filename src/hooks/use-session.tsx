import { useContext } from "react";
import { SessionContext } from "~/providers/session-provider";
// Custom hook to use the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
