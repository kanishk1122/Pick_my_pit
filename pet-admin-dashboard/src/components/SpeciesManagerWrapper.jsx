"use client";

import { Suspense } from "react";
import SpeciesManager from "./SpeciesManager";

export default function SpeciesManagerWrapper() {
  return (
    <Suspense fallback={<div>Loading Species Manager...</div>}>
      <SpeciesManager />
    </Suspense>
  );
}
