import { PropsWithChildren } from "react";
import { Metadata } from "next";
import { SessionProvider } from "~/providers/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jacob's Day",
};

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html>
      <body>
        <SessionProvider>
          <div className="container mx-auto bg-blue-100 min-h-screen">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

export { RootLayout as Layout };
