"use client";

import React, { Suspense } from "react";
import GallerySection from "@/components/gallery-section";

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted text-sm font-mono animate-pulse">
            Loading gallery…
          </div>
        </div>
      }
    >
      <div className="pt-16">
        <GallerySection />
      </div>
    </Suspense>
  );
}
