import { Suspense } from "react";
import CreateMedicineClient from "./CreateMedicineClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateMedicineClient />
    </Suspense>
  );
}
