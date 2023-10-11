import { PropsWithChildren } from "react";
import Header from "~/components/header";
import TopNav from "~/components/top-nav";

export default function SecureLayout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header>
        <TopNav />
      </Header>
      <main className="w-4/6 mx-auto text-black">{children}</main>
    </>
  );
}
