"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "~/hooks/use-session";

const LoginForm = ({ afterLogin }: { afterLogin?: string }) => {
  const router = useRouter();
  const { isLoggedIn, logIn, logInError } = useSession();
  const [errorMessage, setErrorMessage] = useState(logInError?.message);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = new FormData(e.target as HTMLFormElement);
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        logIn({ email, password });
      } catch (error) {
        console.error(error);
        setErrorMessage("Login failed"); // Set error message
      }
    },
    [logIn]
  );

  useEffect(() => {
    if (isLoggedIn()) {
      if (afterLogin != null) {
        router.push(afterLogin);
        return;
      }
      router.push("/secure/today");
    }
    if (logInError != null) {
      setErrorMessage(`Error: ${logInError.message}`); // Set error message
    }
  }, [isLoggedIn, logInError, router, afterLogin]);

  return (
    <div className="flex justify-center items-center h-96 -mb-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-xs"
      >
        <div className="mb-4">
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="text"
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center justify-end">
          {" "}
          {/* Changed to justify-end */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
