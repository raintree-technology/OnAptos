"use client";

import dynamic from "next/dynamic";

const VirtualizedTokenList = dynamic(
  () => import("./VirtualizedTokenList").then((m) => ({ default: m.VirtualizedTokenList })),
  { loading: () => <div className="h-96 animate-pulse bg-gray-200 rounded" /> }
);

export default function TokensPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 flex-1 relative">
        <VirtualizedTokenList />
      </main>
    </div>
  );
}
