"use client";

import { useMemo, useState } from "react";
import { Activity, Plus, RotateCcw, Trash2, Sparkles, Scan } from "lucide-react";
import DentalViewer, { type DentalPost } from "@/components/DentalViewer";

const TEETH = [
  [18,"3º molar superior direito"],[17,"2º molar superior direito"],[16,"1º molar superior direito"],[15,"2º pré-molar superior direito"],
  [14,"1º pré-molar superior direito"],[13,"Canino superior direito"],[12,"Incisivo lateral superior direito"],[11,"Incisivo central superior direito"],
  [21,"Incisivo central superior esquerdo"],[22,"Incisivo lateral superior esquerdo"],[23,"Canino superior esquerdo"],[24,"1º pré-molar superior esquerdo"],
  [25,"2º pré-molar superior esquerdo"],[26,"1º molar superior esquerdo"],[27,"2º molar superior esquerdo"],[28,"3º molar superior esquerdo"],
  [48,"3º molar inferior direito"],[47,"2º molar inferior direito"],[46,"1º molar inferior direito"],[45,"2º pré-molar inferior direito"],
  [44,"1º pré-molar inferior direito"],[43,"Canino inferior direito"],[42,"Incisivo lateral inferior direito"],[41,"Incisivo central inferior direito"],
  [31,"Incisivo central inferior esquerdo"],[32,"Incisivo lateral inferior esquerdo"],[33,"Canino inferior esquerdo"],[34,"1º pré-molar inferior esquerdo"],
  [35,"2º pré-molar inferior esquerdo"],[36,"1º molar inferior esquerdo"],[37,"2º molar inferior esquerdo"],[38,"3º molar inferior esquerdo"]
] as const;

const DEFAULT_POST: Omit<DentalPost, "id"> = {
  lengthMm: 8,
  diameterMm: 1.5,
  rootIndex: 0,
  apexDistanceMm: 2,
  offsetXmm: 0,
  offsetZmm: 0,
};

function rootOptions(toothId: number) {
  const n = toothId % 10;
  if (n >= 6) {
    return [
      { value: 0, label: "Raiz vestibular mesial" },
      { value: 1, label: "Raiz vestibular distal" },
      { value: 2, label: "Raiz palatina/lingual" },
    ];
  }
  if (n === 4 || n === 5) {
    return [
      { value: 0, label: "Raiz vestibular" },
      { value: 1, label: "Raiz palatina/lingual" },
    ];
  }
  return [{ value: 0, label: "Raiz única" }];
}

export default function Home() {
  const [toothId, setToothId] = useState(16);
  const [heightMm, setHeightMm] = useState(20);
  const [widthMm, setWidthMm] = useState(10);
  const [mode, setMode] = useState<"Realista" | "Transparente" | "Holográfico">("Realista");
  const [posts, setPosts] = useState<DentalPost[]>([{ id: 1, ...DEFAULT_POST }]);
  const [diameterDrafts, setDiameterDrafts] = useState<Record<number, string>>({});

  const selected = useMemo(
    () => TEETH.find(([id]) => id === toothId)?.[1] ?? "Dente selecionado",
    [toothId]
  );
  const roots = useMemo(() => rootOptions(toothId), [toothId]);

  function updatePost(id: number, field: keyof DentalPost, value: number) {
    setPosts((current) =>
      current.map((post) => post.id === id ? { ...post, [field]: value } : post)
    );
  }

  function addPost() {
    const id = Date.now();
    const usedRoots = new Set(posts.map((post) => post.rootIndex));
    const nextRoot = roots.find((root) => !usedRoots.has(root.value))?.value ?? roots[0].value;
    setPosts((current) => [
      ...current,
      { id, ...DEFAULT_POST, rootIndex: nextRoot },
    ]);
  }

  function reset() {
    setHeightMm(20);
    setWidthMm(10);
    setMode("Realista");
    setPosts([{ id: Date.now(), ...DEFAULT_POST }]);
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-sky-400">
              <Activity size={17} /> Simulador didático
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              EndoPost <span className="text-sky-400">3D Studio</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Selecione um dente e ajuste os pinos por canal radicular.
            </p>
          </div>
          <button className="secondary flex items-center gap-2" onClick={reset}>
            <RotateCcw size={16} /> Restaurar
          </button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[370px_minmax(0,1fr)]">
          <aside className="panel space-y-5 p-5">
            <section>
              <h2 className="mb-3 font-semibold">1. Selecionar dente</h2>
              <label className="label" htmlFor="tooth">Dentição permanente (FDI)</label>
              <select
                id="tooth"
                className="field"
                value={toothId}
                onChange={(e) => {
                  const nextId = Number(e.target.value);
                  setToothId(nextId);
                  const opts = rootOptions(nextId);
                  setPosts((current) => current.map((post) => ({
                    ...post,
                    rootIndex: Math.min(post.rootIndex, opts.length - 1),
                  })));
                }}
              >
                {TEETH.map(([id, name]) => (
                  <option key={id} value={id}>{id} — {name}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">{selected}</p>
              <p className="mt-1 text-xs text-slate-500">Modelos 3D anatômicos GLB com alternância de acabamento realista ou holográfico.</p>
            </section>

            <section className="border-t border-slate-800 pt-5">
              <h2 className="mb-3 font-semibold">2. Dimensões do dente</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="height">Altura (mm)</label>
                  <input id="height" className="field [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" min="1" max="40" step="0.1" value={heightMm}
                    onChange={(e) => setHeightMm(e.target.value === "" ? 1 : Math.min(40, Math.max(1, Number(e.target.value))))} />
                </div>
                <div>
                  <label className="label" htmlFor="width">Largura (mm)</label>
                  <input id="width" className="field [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" min="1" max="25" step="0.1" value={widthMm}
                    onChange={(e) => setWidthMm(e.target.value === "" ? 1 : Math.min(25, Math.max(1, Number(e.target.value))))} />
                </div>
              </div>
            </section>

            <section className="border-t border-slate-800 pt-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-semibold">3. Pinos de fibra</h2>
                <button className="primary flex items-center gap-1.5 text-sm" onClick={addPost}>
                  <Plus size={16} /> Adicionar pino
                </button>
              </div>

              <p className="small-muted mb-3">
                Selecione a raiz de cada pino. A distância ao ápice é medida da ponta apical do pino até o ápice radicular ilustrativo.
              </p>

              <div className="space-y-3">
                {posts.map((post, index) => (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-3" key={post.id}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold">Pino {index + 1}</span>
                      <button
                        aria-label={`Remover pino ${index + 1}`}
                        className="rounded-md p-1.5 text-rose-300 hover:bg-rose-950"
                        onClick={() => setPosts((current) => current.filter((item) => item.id !== post.id))}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <label className="label">Canal / raiz</label>
                    <select
                      className="field mb-3"
                      value={post.rootIndex}
                      onChange={(e) => updatePost(post.id, "rootIndex", Number(e.target.value))}
                    >
                      {roots.map((root) => (
                        <option key={root.value} value={root.value}>{root.label}</option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Comprimento (mm)</label>
                        <input
                          className="field"
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*[.,]?[0-9]*"
                          value={post.lengthMm === 0 ? "" : String(post.lengthMm).replace(".", ",")}
                          onChange={(e) => {
                            const raw = e.target.value.replace(",", ".");
                            if (raw === "" || raw === "." ) {
                              setPosts((current) => current.map((item) =>
                                item.id === post.id ? { ...item, lengthMm: 0 } : item
                              ));
                              return;
                            }
                            if (/^\d*\.?\d*$/.test(raw)) {
                              const parsed = Number(raw);
                              setPosts((current) => current.map((item) =>
                                item.id === post.id ? { ...item, lengthMm: parsed } : item
                              ));
                            }
                          }}
                          onBlur={(e) => {
                            const parsed = Number(e.target.value.replace(",", "."));
                            if (e.target.value.trim() === "" || !Number.isFinite(parsed) || parsed <= 0) {
                              updatePost(post.id, "lengthMm", 0.1);
                            } else {
                              updatePost(post.id, "lengthMm", parsed);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="label">Diâmetro (mm)</label>
                        <input
                          className="field"
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*[.,]?[0-9]*"
                          value={diameterDrafts[post.id] ?? String(post.diameterMm).replace(".", ",")}
                          onChange={(e) => {
                            const typed = e.target.value;
                            // Mantém o texto digitado (inclusive vazio ou "0,") sem o React
                            // substituir a vírgula enquanto a pessoa ainda está editando.
                            if (/^\d*(?:[,.]\d*)?$/.test(typed)) {
                              setDiameterDrafts((current) => ({ ...current, [post.id]: typed }));
                              const normalized = typed.replace(",", ".");
                              if (normalized !== "" && normalized !== "." && normalized !== "0.") {
                                const parsed = Number(normalized);
                                if (Number.isFinite(parsed)) {
                                  updatePost(post.id, "diameterMm", parsed);
                                }
                              } else if (normalized === "") {
                                updatePost(post.id, "diameterMm", 0);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const typed = e.currentTarget.value.trim();
                            const parsed = Number(typed.replace(",", "."));
                            if (typed === "" || !Number.isFinite(parsed) || parsed <= 0) {
                              updatePost(post.id, "diameterMm", 0.1);
                              setDiameterDrafts((current) => {
                                const next = { ...current };
                                delete next[post.id];
                                return next;
                              });
                            } else {
                              updatePost(post.id, "diameterMm", parsed);
                              setDiameterDrafts((current) => {
                                const next = { ...current };
                                delete next[post.id];
                                return next;
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="label">Distância da ponta do pino ao ápice (mm)</label>
                        <input className="field [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" min="0" step="0.1" value={post.apexDistanceMm}
                          onChange={(e) => updatePost(post.id, "apexDistanceMm", Math.max(0, Number(e.target.value) || 0))} />
                      </div>
                      <div>
                        <label className="label">Ajuste lateral X (mm)</label>
                        <div className="flex overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                          <button
                            type="button"
                            aria-label="Diminuir ajuste X"
                            title="Diminuir X em 0,1 mm"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-slate-700 text-xl font-bold text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                            onClick={() => updatePost(post.id, "offsetXmm", Number((post.offsetXmm - 0.1).toFixed(2)))}
                          >−</button>
                          <input
                            className="min-w-0 w-full bg-transparent px-1 text-center text-base text-white outline-none"
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            value={post.offsetXmm}
                            onChange={(e) => updatePost(post.id, "offsetXmm", Number(e.target.value.replace(",", ".")) || 0)}
                          />
                          <button
                            type="button"
                            aria-label="Aumentar ajuste X"
                            title="Aumentar X em 0,1 mm"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border-l border-slate-700 text-xl font-bold text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                            onClick={() => updatePost(post.id, "offsetXmm", Number((post.offsetXmm + 0.1).toFixed(2)))}
                          >+</button>
                        </div>
                      </div>
                      <div>
                        <label className="label">Ajuste lateral Z (mm)</label>
                        <div className="flex overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                          <button
                            type="button"
                            aria-label="Diminuir ajuste Z"
                            title="Diminuir Z em 0,1 mm"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border-r border-slate-700 text-xl font-bold text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                            onClick={() => updatePost(post.id, "offsetZmm", Number((post.offsetZmm - 0.1).toFixed(2)))}
                          >−</button>
                          <input
                            className="min-w-0 w-full bg-transparent px-1 text-center text-base text-white outline-none"
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            value={post.offsetZmm}
                            onChange={(e) => updatePost(post.id, "offsetZmm", Number(e.target.value.replace(",", ".")) || 0)}
                          />
                          <button
                            type="button"
                            aria-label="Aumentar ajuste Z"
                            title="Aumentar Z em 0,1 mm"
                            className="flex h-11 w-11 shrink-0 items-center justify-center border-l border-slate-700 text-xl font-bold text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                            onClick={() => updatePost(post.id, "offsetZmm", Number((post.offsetZmm + 0.1).toFixed(2)))}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          </aside>

          <section className="panel min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-semibold">Visualizador 3D · {mode}</h2>
                <p className="mt-1 text-xs text-slate-400">Dente {toothId} · {selected}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-1">
                  <button type="button" onClick={() => setMode("Realista")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${mode === "Realista" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}>
                    <Scan size={14} /> Realista
                  </button>
                  <button type="button" onClick={() => setMode("Transparente")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${mode === "Transparente" ? "bg-sky-950 text-sky-200 ring-1 ring-sky-700" : "text-slate-400 hover:text-sky-200"}`}>
                    <Scan size={14} /> Transparente
                  </button>
                  <button type="button" onClick={() => setMode("Holográfico")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${mode === "Holográfico" ? "bg-cyan-950 text-cyan-200 ring-1 ring-cyan-700" : "text-slate-400 hover:text-cyan-200"}`}>
                    <Sparkles size={14} /> Holográfico
                  </button>
                </div>
                <span className="rounded-full border border-sky-900 bg-sky-950 px-3 py-1.5 text-sky-300">Unidade: mm</span>
                <span className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-300">{posts.length} pino(s)</span>
              </div>
            </div>
            <div className="h-[560px]">
              <DentalViewer toothId={toothId} heightMm={heightMm} widthMm={widthMm} posts={posts} showCement={false} mode={mode} />
            </div>
            <div className="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">Altura configurada</p>
                <p className="mt-1 text-lg font-semibold">{heightMm.toFixed(1)} <span className="text-sm text-slate-400">mm</span></p>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">Largura configurada</p>
                <p className="mt-1 text-lg font-semibold">{widthMm.toFixed(1)} <span className="text-sm text-slate-400">mm</span></p>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-xs text-slate-400">Pinos configurados</p>
                <p className="mt-1 text-lg font-semibold">{posts.length}</p>
              </div>
            </div>
          </section>
        </div>

        <footer className="small-muted mt-5">
          Protótipo exclusivamente didático. A raiz e os canais são representações simplificadas; a posição e a distância configuradas não substituem avaliação anatômica ou radiográfica.
        </footer>
      </div>
    </main>
  );
}
