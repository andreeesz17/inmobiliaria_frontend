import { useEffect, useState } from "react";
import { getUsers } from "../../api/users.api";
import type { User } from "../../types/user.types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([]);

  useEffect(() => {
    getUsers({ page: 1, limit: 100 }).then((res) => {
      const items = res.data ?? [];
      setAgents(items.filter((u) => (u.role ?? "").toLowerCase() === "agent"));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agentes</h1>

      <ul className="bg-white rounded shadow divide-y">
        {agents.map((a) => (
          <li key={a.id} className="p-3">
            {a.username ?? "-"}
          </li>
        ))}
      </ul>
    </div>
  );
}
