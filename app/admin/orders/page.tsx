"use client";

import { useEffect, useState, useTransition } from "react";
import { getAllOrders, updateOrderStatus, formatPrice, type Order } from "@/app/lib/api";
import Select from "@/app/components/Select";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_OPTIONS = STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s }));

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updating, setUpdating] = useState<string | null>(null);

  const load = (status?: string) => {
    startTransition(async () => {
      try {
        const data = await getAllOrders(status || undefined);
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      }
    });
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Orders</h1>
        <Select
          value={filter}
          onChange={setFilter}
          options={[{ label: "All statuses", value: "" }, ...STATUS_OPTIONS]}
          className="h-10 rounded-full border border-secondary bg-card px-4 text-sm focus:border-primary"
        />
      </div>

      {isPending && <p className="mt-8 text-sm text-foreground/50">Loading…</p>}
      {error && (
        <p className="mt-8 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!isPending && !error && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-secondary">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/30 text-xs uppercase tracking-wide text-foreground/50">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-secondary/60 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60">
                    {o._id.slice(-8)}
                  </td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3 text-foreground/60">
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-foreground/60">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={o.status}
                      disabled={updating === o._id}
                      onChange={(v) => handleStatusChange(o._id, v)}
                      options={STATUS_OPTIONS}
                      className="h-9 w-full rounded-lg border border-secondary bg-background px-2 text-sm focus:border-primary disabled:opacity-50"
                      containerClassName="block w-full"
                    />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
