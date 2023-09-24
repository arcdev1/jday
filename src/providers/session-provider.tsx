"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SESSION_KEY, makeSession, Session } from "~/models/session";

// Create a context for the session
export const SessionContext = createContext<Session | null>(null);

// Provider component
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check cache first
    const cachedSession = sessionStorage.getItem(SESSION_KEY);
    if (cachedSession) {
      const sessionJson = JSON.parse(cachedSession);
      setSession({
        ...sessionJson,
        expiry: new Date(sessionJson.expiry),
      });
      return;
    }

    // Fetch from API
    fetch("/api/session")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to fetch session");
      })
      .then((json) => {
        const newSession: Session = makeSession({
          ...json,
          expiry: new Date(json.expiry),
        });
        setSession(newSession);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      });
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
