import React from "react";
import Header from "~/components/header";
import LoginForm from "~/components/login-form";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <Header />
      <LoginForm afterLogin={searchParams["next"] as string} />
    </>
  );
}
