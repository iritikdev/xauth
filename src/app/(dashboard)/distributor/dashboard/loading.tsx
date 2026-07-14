"use client";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header placeholder */}
      <div className="h-10 w-64 rounded-lg bg-zinc-200" />

      {/* Stats grid placeholder */}
      <div className="grid grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-zinc-200"
          />
        ))}
      </div>

      {/* Main content placeholder */}
      <div className="h-96 rounded-xl bg-zinc-200" />
    </div>
  );
}
