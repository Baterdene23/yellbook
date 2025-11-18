"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type AdminFormState = {
  name: string;
  orgType: string;
  province: string;
  district: string;
  sortKey: string;
  lat: string;
  lng: string;
  phone: string;
  email: string;
  website: string;
};

const initialForm: AdminFormState = {
  name: "",
  orgType: "BUSINESS",
  province: "",
  district: "",
  sortKey: "А",
  lat: "",
  lng: "",
  phone: "",
  email: "",
  website: "",
};

export default function Admin() {
  const [form, setForm] = useState<AdminFormState>(initialForm);

  async function create() {
    const payload = {
      name: form.name,
      orgType: form.orgType,
      keywords: [],
      description: "",
      sortKey: form.sortKey,
      address: {
        country: "Mongolia",
        province: form.province,
        district: form.district || undefined,
        geolocation:
          form.lat && form.lng
            ? { lat: Number.parseFloat(form.lat), lng: Number.parseFloat(form.lng) }
            : undefined,
      },
      contact: {
        phone: form.phone ? [form.phone] : [],
        email: form.email ? [form.email] : [],
        website: form.website || undefined,
      },
    };

    const response = await fetch(`${API}/yellow-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert(`Алдаа: ${await response.text()}`);
    } else {
      alert("Амжилттай нэмлээ!");
      setForm(initialForm);
    }
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Admin — Байгууллага нэмэх</h1>
      <input
        placeholder="Нэр"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <select
        value={form.orgType}
        onChange={(event) => setForm({ ...form, orgType: event.target.value })}
      >
        <option value="BUSINESS">BUSINESS</option>
        <option value="NGO">NGO</option>
        <option value="GOVERNMENT">GOVERNMENT</option>
        <option value="SERVICE">SERVICE</option>
        <option value="MUNICIPAL">MUNICIPAL</option>
      </select>
      <input
        placeholder="Аймаг/нийслэл"
        value={form.province}
        onChange={(event) => setForm({ ...form, province: event.target.value })}
      />
      <input
        placeholder="Дүүрэг/сум"
        value={form.district}
        onChange={(event) => setForm({ ...form, district: event.target.value })}
      />
      <input
        placeholder="SortKey (А)"
        value={form.sortKey}
        onChange={(event) => setForm({ ...form, sortKey: event.target.value })}
      />
      <input
        placeholder="lat"
        value={form.lat}
        onChange={(event) => setForm({ ...form, lat: event.target.value })}
      />
      <input
        placeholder="lng"
        value={form.lng}
        onChange={(event) => setForm({ ...form, lng: event.target.value })}
      />
      <input
        placeholder="Утас"
        value={form.phone}
        onChange={(event) => setForm({ ...form, phone: event.target.value })}
      />
      <input
        placeholder="Имэйл"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <input
        placeholder="Вэб"
        value={form.website}
        onChange={(event) => setForm({ ...form, website: event.target.value })}
      />
      <button type="button" onClick={create}>
        Нэмэх
      </button>
    </main>
  );
}
