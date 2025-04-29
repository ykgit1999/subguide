"use client";
import { useState, KeyboardEvent } from "react";
import useSWR from "swr";

/* =========================================
   設定
========================================= */
const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

/* =========================================
   UI
========================================= */
export default function Home() {
  const [kw, setKw] = useState("");
  const [query, setQuery] = useState("");

  const { data } = useSWR(
    query ? `${base}/search?keywords=${encodeURIComponent(query)}` : null,
    fetcher
  );

  const search = () => setQuery(kw.trim());
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">サブスク TV ガイド PoC</h1>

      {/* ── 検索バー ───────────────────── */}
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="作品名を入力"
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          onKeyDown={onKey}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={search}
        >
          検索
        </button>
      </div>

      {/* ── 検索結果 ─────────────────── */}
      <ul className="mt-6 grid grid-cols-2 gap-4">
        {(data ?? []).map((t: any) => {
          // providers が "[]" の文字列として来る場合があるので安全に配列化
          let provArr: string[] = [];
          if (Array.isArray(t.providers)) {
            provArr = t.providers;
          } else if (typeof t.providers === "string" && t.providers.length) {
            try {
              provArr = JSON.parse(t.providers);
            } catch {
              provArr = [];
            }
          }

          return (
            <li key={t.id} className="border p-3 rounded space-y-1">
              <p className="font-semibold">{t.title_jp || t.title_en}</p>
              <p className="text-xs text-gray-500">{t.release_date}</p>

              {/* 配信サービスバッジ */}
              <div className="flex flex-wrap gap-1">
                {provArr.map((p) => (
                  <span
                    key={p}
                    className="px-1.5 py-0.5 text-xs bg-slate-200 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}