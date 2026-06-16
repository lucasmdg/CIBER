"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, Search } from "lucide-react";
import type { SampleAsset } from "@/lib/data/samples";

type Asset = SampleAsset & { id: string };

export default function AssetsPage() {
  const [items, setItems] = React.useState<Asset[]>([]);
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<SampleAsset>({
    name: "",
    ip: "",
    os: "",
    owner: "",
    type: "server",
    criticality: "medium",
    riskScore: 30
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const toast = useToast();

  async function load() {
    const r = await fetch("/api/assets", { cache: "no-store" });
    const data = await r.json();
    setItems(data.assets ?? []);
  }
  React.useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((a) => {
    const matchesQ = [a.name, a.ip, a.owner, a.os].some((v) => v.toLowerCase().includes(search.toLowerCase()));
    const matchesT = type === "all" || a.type === type;
    return matchesQ && matchesT;
  });

  async function add() {
    setFormError(null);
    setSubmitting(true);
    const r = await fetch("/api/assets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    setSubmitting(false);
    if (!r.ok) {
      const body = await r.json().catch(() => ({}));
      setFormError(body.error ?? "Validation failed");
      return;
    }
    setOpen(false);
    setForm({ ...form, name: "", ip: "", os: "" });
    toast.push({ title: "Asset added", tone: "success" });
    load();
  }

  async function remove(id: string) {
    const r = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast.push({ title: "Asset removed", tone: "warn" });
      load();
    }
  }

  return (
    <>
      <PageHeader
        title="Asset Inventory"
        description="Servers, workstations, containers, cloud and network assets under SentinelX protection."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Register asset
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Assets</CardTitle>
            <CardSubtitle>{filtered.length} of {items.length} shown</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search name, IP, owner, OS…"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              <option value="server">Server</option>
              <option value="workstation">Workstation</option>
              <option value="container">Container</option>
              <option value="cloud">Cloud</option>
              <option value="network">Network</option>
            </Select>
          </div>

          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>IP</Th>
                <Th>OS</Th>
                <Th>Type</Th>
                <Th>Owner</Th>
                <Th>Criticality</Th>
                <Th className="text-right">Risk</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((a) => (
                <Tr key={a.id}>
                  <Td className="font-mono text-cyber-200">{a.name}</Td>
                  <Td className="font-mono text-slate-300">{a.ip}</Td>
                  <Td>{a.os}</Td>
                  <Td className="capitalize">{a.type}</Td>
                  <Td>{a.owner}</Td>
                  <Td>
                    <Badge tone={a.criticality}>{a.criticality}</Badge>
                  </Td>
                  <Td className="text-right">
                    <span className={a.riskScore >= 70 ? "text-danger" : a.riskScore >= 40 ? "text-warning" : "text-success"}>
                      {a.riskScore}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => remove(a.id)} aria-label={`Delete ${a.name}`}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </Td>
                </Tr>
              ))}
              {filtered.length === 0 && (
                <Tr>
                  <Td colSpan={8} className="text-center text-slate-500">No assets match your filter.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <h2 className="text-lg font-semibold text-white">Register a new asset</h2>
        <p className="mt-1 text-sm text-slate-400">All fields are validated server-side with Zod.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name (hostname)">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="edge-fw-02" />
          </Field>
          <Field label="IPv4 address">
            <Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="10.10.0.50" />
          </Field>
          <Field label="Operating system">
            <Input value={form.os} onChange={(e) => setForm({ ...form, os: e.target.value })} placeholder="Ubuntu 24.04" />
          </Field>
          <Field label="Owner">
            <Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="netops" />
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SampleAsset["type"] })}>
              <option value="server">Server</option>
              <option value="workstation">Workstation</option>
              <option value="container">Container</option>
              <option value="cloud">Cloud</option>
              <option value="network">Network</option>
            </Select>
          </Field>
          <Field label="Criticality">
            <Select value={form.criticality} onChange={(e) => setForm({ ...form, criticality: e.target.value as SampleAsset["criticality"] })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </Field>
          <Field label="Risk score (0–100)">
            <Input
              type="number"
              min={0}
              max={100}
              value={form.riskScore}
              onChange={(e) => setForm({ ...form, riskScore: Number(e.target.value) })}
            />
          </Field>
        </div>
        {formError && <p className="mt-3 text-sm text-danger">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={add} disabled={submitting}>{submitting ? "Saving..." : "Save asset"}</Button>
        </div>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-wide text-slate-400">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
