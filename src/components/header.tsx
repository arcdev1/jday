import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Header({ children }: PropsWithChildren<{}>) {
  return (
    <header className="flex justify-between items-center bg-sky-400 p-4">
      <h1 className="text-2xl text-white">
        <Link href="/">Jacob&rsquo;s Day</Link>
      </h1>
      {children}
    </header>
  );
}
