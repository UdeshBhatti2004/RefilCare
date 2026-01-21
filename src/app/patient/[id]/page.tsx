"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"


type Patient = {
  _id: string
  name: string
  phone: string
}

type Medicine = {
  _id: string
  medicineName: string
  refillDate: string
  status: string
}


export default function PatientDetailPage() {
  const { id } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [medicines, setMedicines] = useState<Medicine[]>([])


  useEffect(() => {
    if (!id) return

    fetch(`/api/patients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => {
        setPatient(data)
        setLoading(false)
      })
      .catch(() => {
        setPatient(null)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
  if (!id) return

  fetch(`/api/medicines?patientId=${id}`)
    .then((res) => res.json())
    .then((data) => setMedicines(data))
}, [id])


  if (loading) {
    return <div className="p-6">Loading patient...</div>
  }

  if (!patient) {
    return <div className="p-6">Patient not found</div>
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">
        Patient Details
      </h1>

      <div className="border rounded p-4 space-y-2">
        <p>
          <span className="font-medium">Name:</span>{" "}
          {patient.name}
        </p>
        <p>
          <span className="font-medium">Phone:</span>{" "}
          {patient.phone}
        </p>
      </div>
      <div className="mt-6">
  <h2 className="text-lg font-semibold mb-3">
    Medicines
  </h2>

  {medicines.length === 0 && (
    <p className="text-sm text-gray-600">
      No medicines for this patient.
    </p>
  )}

  <ul className="space-y-2">
    {medicines.map((med) => (
      <li
        key={med._id}
        className="border rounded p-3"
      >
        <p className="font-medium">{med.medicineName}</p>
        <p className="text-sm text-gray-600">
          Refill: {new Date(med.refillDate).toDateString()}
        </p>
        <p className="text-sm">
          Status: <strong>{med.status}</strong>
        </p>
      </li>
    ))}
  </ul>
</div>

<Link
  href={`/medicine/createmedicine?patientId=${id}`}
  className="inline-block mb-6 px-4 py-2 border rounded text-sm hover:bg-gray-100"
>
  + Add Medicine
</Link>


    </div>
  )
}
