import { PropsWithChildren } from "react";
import Header from "~/components/header";
import TopNav from "~/components/top-nav";
import { SessionProvider } from "~/providers/session-provider";

export default function SecureLayout({ children }: PropsWithChildren<{}>) {
  return (
    <SessionProvider>
      <Header>
        <TopNav />
      </Header>
      <main className="w-4/6 mx-auto">{children}</main>
    </SessionProvider>
  );
}
