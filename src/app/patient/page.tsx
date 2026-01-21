"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Patient = {
  _id: string
  name: string
  phone: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6">Loading patients...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Patients</h1>

      {patients.length === 0 && (
        <p>No patients found.</p>
      )}

      <ul className="space-y-3">
        {patients.map((patient) => (
          <li
            key={patient._id}
            className="border rounded p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-gray-600">{patient.phone}</p>
            </div>

            <Link
              href={`/patient/${patient._id}`}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
