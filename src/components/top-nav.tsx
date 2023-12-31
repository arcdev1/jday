import Link from "next/link";
import { getCurrentSession } from "~/use-cases/helpers/session-utils";

export default function TopNav() {
  const session = getCurrentSession();
  return session != null ? (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <Link href="/secure/today" className="text-white">
            Today
          </Link>
        </li>
        <li>
          <Link href="/secure/history" className="text-white">
            History
          </Link>
        </li>
        <li>
          <Link
            href="/secure/profile"
            className="text-white rounded-full px-2 py-1 bg-blue-700"
          >
            {session.name[0]}
          </Link>
        </li>
      </ul>
    </nav>
  ) : null;
}
