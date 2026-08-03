"use client";

import type { FormEvent, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSubscribers,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  type SubscriberListItem,
} from "@/app/actions/subscribers";
import { SubscribersTable, type PlanInfo } from "./SubscribersTable";

export function SubscribersPageClient({ plans }: { plans: PlanInfo[] }): ReactElement {
  const router = useRouter();
  const [list, setList] = useState<SubscriberListItem[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [createCountry, setCreateCountry] = useState("SA");
  const [createAnnual, setCreateAnnual] = useState(false);

  const [editCountry, setEditCountry] = useState("SA");
  const [editAnnual, setEditAnnual] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getSubscribers({ search: search || undefined }).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!editingId) return;
    const row = list.find((r) => r.id === editingId);
    if (row) {
      setEditCountry(row.country);
      setEditAnnual(row.isAnnual);
    }
  }, [editingId, list]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createSubscriber(formData);
    if (result.success) {
      setCreateOpen(false);
      (e.target as HTMLFormElement).reset();
      setCreateCountry("SA");
      setCreateAnnual(false);
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleUpdate = async (id: string, e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const result = await updateSubscriber(id, {
      contactName: (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim(),
      email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim(),
      phone: (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim(),
      businessName: (form.querySelector('[name="businessName"]') as HTMLInputElement)?.value?.trim() || null,
      businessType: (form.querySelector('[name="businessType"]') as HTMLInputElement)?.value?.trim() || null,
      planName: (form.querySelector('[name="planName"]') as HTMLInputElement)?.value?.trim() ?? "",
      planIndex: (() => {
        const v = parseInt((form.querySelector('[name="planIndex"]') as HTMLInputElement)?.value ?? "", 10);
        return Number.isInteger(v) ? v : null;
      })(),
      country: (form.querySelector('[name="country"]') as HTMLInputElement)?.value ?? "SA",
      isAnnual:
        (form.querySelector('[name="isAnnual"]') as HTMLInputElement)?.value === "true" ||
        (form.querySelector('[name="isAnnual"]') as HTMLInputElement)?.value === "on",
    });
    if (result.success) {
      setEditingId(null);
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const result = await deleteSubscriber(id);
    if (result.success) {
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  return (
    <SubscribersTable
      list={list}
      activePlans={plans}
      loading={loading}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      setSearch={setSearch}
      createOpen={createOpen}
      setCreateOpen={setCreateOpen}
      editingId={editingId}
      setEditingId={setEditingId}
      formError={formError}
      createCountry={createCountry}
      setCreateCountry={setCreateCountry}
      createAnnual={createAnnual}
      setCreateAnnual={setCreateAnnual}
      editCountry={editCountry}
      setEditCountry={setEditCountry}
      editAnnual={editAnnual}
      setEditAnnual={setEditAnnual}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
