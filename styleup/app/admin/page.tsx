"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalRevenue: number;
  totalGMV: number;
  confirmedBookings: number;
  pendingApplications: number;
  activeStylists: number;
  recentBookings: Array<{
    id: string;
    status: string;
    price: number;
    platform_fee: number;
    payment_status: string;
    created_at: string;
  }>;
  stylists: Array<{
    id: string;
    name: string;
    status: string;
    sessions_completed: number;
    rating: number;
  }>;
  applications: Array<{
    id: string;
    status: string;
    created_at: string;
  }>;
}

function fmt(pence: number) {
  return `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 0 })}`;
}

function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    confirmed: "#22c55e",
    pending_payment: "#f59e0b",
    completed: "#6366f1",
    cancelled: "#ef4444",
    paid: "#22c55e",
    unpaid: "#f59e0b",
    active: "#22c55e",
    pending: "#f59e0b",
    approved: "#22c55e",
    rejected: "#ef4444",
  };
  const c = colours[status] ?? "#9ca3af";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: c + "22", color: c }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "bookings" | "stylists" | "applications">("overview");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("not_authenticated");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/stats", {
        headers: { authorization: `Bearer ${session.access_token}` },
      });

      if (res.status === 403) {
        setError("not_admin");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    load();
  }, []);

  const approveApplication = async (id: string, status: "approved" | "rejected") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    // Refresh
    window.location.reload();
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--dim)" }}>Loading…</p>
      </main>
    );
  }

  if (error === "not_authenticated") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card p-8 text-center max-w-sm">
          <p className="font-semibold mb-3">Sign in to access admin</p>
          <Link href="/auth/login" className="btn-primary">Sign in</Link>
        </div>
      </main>
    );
  }

  if (error === "not_admin") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card p-8 text-center max-w-sm">
          <p className="text-2xl mb-3">🚫</p>
          <p className="font-semibold mb-1">Admin access only</p>
          <p className="text-sm" style={{ color: "var(--dim)" }}>Your account doesn&apos;t have admin privileges.</p>
          <Link href="/" className="btn-secondary mt-4 block">Back to home</Link>
        </div>
      </main>
    );
  }

  const s = stats!;

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "bookings", label: `Bookings (${s.recentBookings.length})` },
    { key: "stylists", label: `Stylists (${s.stylists.length})` },
    { key: "applications", label: `Applications${s.pendingApplications > 0 ? ` · ${s.pendingApplications} pending` : ""}` },
  ] as const;

  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
          <span className="chip text-xs">Admin</span>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
          className="text-sm"
          style={{ color: "var(--dim)" }}
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="serif text-2xl font-bold mb-6">Dashboard</h1>

        {/* KPI cards */}
        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {[
            { label: "Platform revenue", value: fmt(s.totalRevenue), sub: "from platform fees" },
            { label: "Total GMV", value: fmt(s.totalGMV), sub: "gross booking value" },
            { label: "Paid bookings", value: s.confirmedBookings, sub: "lifetime" },
            { label: "Active stylists", value: s.activeStylists, sub: "on platform" },
            { label: "Pending applications", value: s.pendingApplications, sub: "awaiting review" },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <p className="serif text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{k.value}</p>
              <p className="text-xs font-semibold mb-0.5">{k.label}</p>
              <p className="text-xs" style={{ color: "var(--faint)" }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
                color: tab === t.key ? "var(--ink)" : "var(--dim)",
                background: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="card p-5">
              <p className="font-semibold text-sm mb-4">Recent bookings</p>
              <div className="flex flex-col gap-3">
                {s.recentBookings.slice(0, 6).map((b) => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono" style={{ color: "var(--faint)" }}>{b.id}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={b.payment_status} />
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{fmt(b.price)}</p>
                      <p className="text-xs" style={{ color: "var(--faint)" }}>+{fmt(b.platform_fee)} fee</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <p className="font-semibold text-sm mb-4">Pending applications</p>
              {s.applications.filter(a => a.status === "pending").length === 0 ? (
                <p className="text-sm" style={{ color: "var(--dim)" }}>No pending applications</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {s.applications.filter(a => a.status === "pending").slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono" style={{ color: "var(--faint)" }}>{a.id.slice(0, 8)}…</p>
                        <p className="text-xs" style={{ color: "var(--dim)" }}>
                          {new Date(a.created_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveApplication(a.id, "approved")}
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: "#22c55e22", color: "#22c55e" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => approveApplication(a.id, "rejected")}
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: "#ef444422", color: "#ef4444" }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--accent-bg)" }}>
                <tr>
                  {["Booking ID", "Date", "Price", "Platform fee", "Status", "Payment"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--faint)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.recentBookings.map((b, i) => (
                  <tr key={b.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--dim)" }}>{b.id}</td>
                    <td className="px-4 py-3 text-xs">{new Date(b.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(b.price)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--accent)" }}>{fmt(b.platform_fee)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={b.payment_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stylists */}
        {tab === "stylists" && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--accent-bg)" }}>
                <tr>
                  {["Name", "Status", "Sessions", "Rating"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--faint)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.stylists.map((st, i) => (
                  <tr key={st.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                    <td className="px-4 py-3 font-medium">{st.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={st.status} /></td>
                    <td className="px-4 py-3">{st.sessions_completed}</td>
                    <td className="px-4 py-3">⭐ {st.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Applications */}
        {tab === "applications" && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--accent-bg)" }}>
                <tr>
                  {["ID", "Submitted", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--faint)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.applications.map((a, i) => (
                  <tr key={a.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--dim)" }}>{a.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      {a.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveApplication(a.id, "approved")}
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{ background: "#22c55e22", color: "#22c55e" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => approveApplication(a.id, "rejected")}
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{ background: "#ef444422", color: "#ef4444" }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
