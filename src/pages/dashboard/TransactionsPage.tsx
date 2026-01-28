import { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions.api";
import type { Transaction } from "../../types/transaction.types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then((data) => setTransactions(data as any));
  }, []);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transacciones</h1>
          <p className="text-sm text-slate-600">
            Movimientos registrados por propiedades y clientes.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total: {transactions.length}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-slate-900">
                ${t.monto}
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t.estado}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Tipo: <span className="font-medium">{t.tipo_transaccion}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Cliente #{t.id_cliente} · Casa #{t.id_casa}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
