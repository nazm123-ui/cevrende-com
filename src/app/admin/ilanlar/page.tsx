"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  jobType: string;
  neighborhood: string;
  salaryAmount: number | null;
  salaryType: string;
  status: string;
  createdAt: string;
  employer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  category: {
    slug: string;
    name: string;
  };
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs");
      if (!res.ok) throw new Error("İlanlar yüklenemedi.");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function approve(jobId: string) {
    setActionLoading(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Onaylama başarısız.");
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setActionLoading(null);
    }
  }

  async function reject(jobId: string) {
    setActionLoading(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Reddetme başarısız.");
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        ← Adminə Dön
      </Link>

      <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
        İncelemede İlanlar
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Toplamda {jobs.length} ilan incelemede bekliyor.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-ink-500">Yükleniyor...</p>
      ) : jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-base font-medium text-ink-900">
            İncelemede ilan yok.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-ink-200 bg-white p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-900">{job.title}</h3>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-500">
                    <span className="bg-ink-50 px-2 py-1 rounded">
                      {job.category.name}
                    </span>
                    <span className="bg-ink-50 px-2 py-1 rounded">
                      {job.neighborhood}
                    </span>
                    {job.salaryAmount && (
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                        {job.salaryAmount} TL
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-ink-500">
                    <p>
                      <strong>İşveren:</strong> {job.employer.fullName} (
                      {job.employer.email})
                    </p>
                    <p>
                      <strong>Telefon:</strong> {job.employer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => approve(job.id)}
                    disabled={actionLoading === job.id}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
                  >
                    {actionLoading === job.id ? "İşleniyor..." : "Onayla"}
                  </button>
                  <button
                    onClick={() => reject(job.id)}
                    disabled={actionLoading === job.id}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:bg-ink-200 disabled:cursor-not-allowed"
                  >
                    {actionLoading === job.id ? "İşleniyor..." : "Reddet"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
