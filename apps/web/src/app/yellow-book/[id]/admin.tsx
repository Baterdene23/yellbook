// apps/web/pages/admin.tsx
import { useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Admin() {
  const [form, setForm] = useState({
    name: '', orgType: 'BUSINESS', province: '', district: '', sortKey: 'А',
    lat: '', lng: '', phone: '', email: '', website: ''
  });

  async function create() {
    const payload = {
      name: form.name,
      orgType: form.orgType,
      keywords: [],
      description: '',
      sortKey: form.sortKey,
      address: {
        country: 'Mongolia', province: form.province,
        district: form.district || undefined,
        geolocation: form.lat && form.lng ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined
      },
      contact: {
        phone: form.phone ? [form.phone] : [],
        email: form.email ? [form.email] : [],
        website: form.website || undefined
      }
    };
    const res = await fetch(`${API}/yellow-books`, {
      method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload)
    });
    if (!res.ok) alert('Алдаа: ' + (await res.text()));
    else alert('Амжилттай нэмлээ!');
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Admin — Байгууллага нэмэх</h1>
      <input placeholder="Нэр" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
      <select value={form.orgType} onChange={e=>setForm({...form, orgType: e.target.value})}>
        <option value="BUSINESS">BUSINESS</option><option value="NGO">NGO</option>
        <option value="GOVERNMENT">GOVERNMENT</option><option value="EMBASSY_CONSUL">EMBASSY_CONSUL</option>
      </select>
      <input placeholder="Аймаг/нийслэл" value={form.province} onChange={e=>setForm({...form, province: e.target.value})}/>
      <input placeholder="Дүүрэг/сум" value={form.district} onChange={e=>setForm({...form, district: e.target.value})}/>
      <input placeholder="SortKey (А)" value={form.sortKey} onChange={e=>setForm({...form, sortKey: e.target.value})}/>
      <input placeholder="lat" value={form.lat} onChange={e=>setForm({...form, lat: e.target.value})}/>
      <input placeholder="lng" value={form.lng} onChange={e=>setForm({...form, lng: e.target.value})}/>
      <input placeholder="Утас" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})}/>
      <input placeholder="Имэйл" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
      <input placeholder="Вэб" value={form.website} onChange={e=>setForm({...form, website: e.target.value})}/>
      <button onClick={create}>Нэмэх</button>
    </main>
  );
}
