import { Suspense } from "react";
import MedicineClient from "./MedicineClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MedicineClient  />
    </Suspense>
  );
}
