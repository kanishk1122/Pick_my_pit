"use client";

import { Suspense } from "react";
import BreedManager from "./BreedManager";

export default function BreedManagerWrapper() {
  return (
    <Suspense fallback={<div>Loading Breed Manager...</div>}>
      <BreedManager />
    </Suspense>
  );
}
