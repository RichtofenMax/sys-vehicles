"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CARS } from "@/lib/cars-data";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  badge: string;
  photoId: string;
  photoUrl?: string;    // legacy single photo (kept for compat)
  photoUrls?: string[]; // multiple uploaded photos — takes priority
  category: string[];
  status: "available" | "reserved" | "sold";
};

const STORAGE_KEY = "sys-cars";
const ENQUIRIES_KEY = "sys-enquiries";
const ADMIN_PASSWORD = "sysadmin2026";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  car: string;
  message: string;
  submittedAt: string;
  read: boolean;
};

const STARTER_PHOTO_IDS = [
  "1555215695-3d98bc139570",
  "1606664515524-f6d6fc4b8e5e",
  "1503376780353-7e6692767b70",
  "1558981806-ec527fa84c39",
  "1552519507-da3b142c7d7a",
  "1558618666-fcd25c85cd64",
];

function buildCategory(price: number, fuel: string, model: string) {
  const categories = ["all"];
  if (price < 10000) categories.push("under10k");
  if (price >= 10000 && price <= 20000) categories.push("10k-20k");
  if (price > 20000) categories.push("over20k");
  if (fuel.toLowerCase() === "electric") categories.push("electric");
  if (model.toLowerCase().includes("suv") || model.toLowerCase().includes("evoque")) {
    categories.push("suv");
  }
  return categories;
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 12px",
  width: "100%",
  fontSize: "14px",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // ── Car state ──────────────────────────────────────────────────────────────
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS as Car[]);
  // loaded ref prevents the save effect from running before the initial load
  const loaded = useRef(false);

  // ── Add form state ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    make: "", model: "", year: "", price: "",
    mileage: "", fuel: "", transmission: "", color: "", badge: "",
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // ── View toggle + enquiries ────────────────────────────────────────────────
  const [view, setView] = useState<"cars" | "enquiries">("cars");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    if (!authenticated) return;
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    if (raw) { try { setEnquiries(JSON.parse(raw)); } catch { /* empty */ } }
  }, [authenticated]);

  const markRead = (id: number) => {
    const updated = enquiries.map((e) => e.id === id ? { ...e, read: true } : e);
    setEnquiries(updated);
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
  };

  const deleteEnquiry = (id: number) => {
    if (!confirm("Delete this enquiry?")) return;
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
  };

  const unreadCount = enquiries.filter((e) => !e.read).length;

  // ── Edit modal state ───────────────────────────────────────────────────────
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editForm, setEditForm] = useState({
    make: "", model: "", year: "", price: "",
    mileage: "", fuel: "", transmission: "", color: "", badge: "",
  });
  const [editPhotos, setEditPhotos] = useState<string[]>([]);

  // ── Load from localStorage after login ────────────────────────────────────
  useEffect(() => {
    if (!authenticated) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setCars(JSON.parse(raw) as Car[]); } catch { /* keep defaults */ }
    }
    loaded.current = true;
  }, [authenticated]);

  // ── Save to localStorage — only AFTER initial load ────────────────────────
  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  const nextId = useMemo(
    () => (cars.length ? Math.max(...cars.map((c) => c.id)) + 1 : 1),
    [cars]
  );

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthenticated(true); setError(""); return; }
    setError("Incorrect password");
  };

  const updateStatus = (id: number, status: Car["status"]) =>
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const deleteCar = (id: number) => {
    if (!confirm("Remove this car from the listing?")) return;
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Photo upload ───────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removePhoto = (index: number) =>
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));

  // ── Edit handlers ──────────────────────────────────────────────────────────
  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setEditForm({
      make: car.make, model: car.model, year: String(car.year),
      price: String(car.price), mileage: car.mileage, fuel: car.fuel,
      transmission: car.transmission, color: car.color, badge: car.badge ?? "",
    });
    // Load existing photos — uploaded ones first, fallback to unsplash placeholder
    setEditPhotos(car.photoUrls?.length ? car.photoUrls : car.photoUrl ? [car.photoUrl] : []);
  };

  const handleEditPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setEditPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeEditPhoto = (index: number) =>
    setEditPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    const price = Number(editForm.price);
    const year = Number(editForm.year);
    setCars((prev) => prev.map((c) =>
      c.id === editingCar.id ? {
        ...c,
        make: editForm.make.trim(), model: editForm.model.trim(),
        year, price, mileage: editForm.mileage.trim(),
        fuel: editForm.fuel.trim(), transmission: editForm.transmission.trim(),
        color: editForm.color.trim(), badge: editForm.badge.trim(),
        ...(editPhotos.length > 0 ? { photoUrls: editPhotos, photoUrl: undefined } : { photoUrls: undefined }),
        category: buildCategory(price, editForm.fuel.trim(), editForm.model.trim()),
      } : c
    ));
    setEditingCar(null);
  };

  // ── Add car ────────────────────────────────────────────────────────────────
  const handleAddCar = (e: FormEvent) => {
    e.preventDefault();
    const price = Number(formData.price);
    const year = Number(formData.year);
    const photoId = STARTER_PHOTO_IDS[(nextId - 1) % STARTER_PHOTO_IDS.length];

    const newCar: Car = {
      id: nextId,
      make: formData.make.trim(),
      model: formData.model.trim(),
      year, price,
      mileage: formData.mileage.trim(),
      fuel: formData.fuel.trim(),
      transmission: formData.transmission.trim(),
      color: formData.color.trim(),
      badge: formData.badge.trim(),
      photoId,
      ...(photoPreviews.length > 0 ? { photoUrls: photoPreviews } : {}),
      category: buildCategory(price, formData.fuel.trim(), formData.model.trim()),
      status: "available",
    };

    setCars((prev) => [...prev, newCar]);
    setFormData({ make: "", model: "", year: "", price: "", mileage: "", fuel: "", transmission: "", color: "", badge: "" });
    setPhotoPreviews([]);
  };

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main style={{ minHeight: "100vh", background: "#09090f", color: "#fff", padding: "40px 24px" }}>
        <div style={{ maxWidth: "420px", margin: "60px auto", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>SYS Admin</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password" style={{ ...inputStyle, marginBottom: "12px" }} />
            {error && <p style={{ color: "#ef4444", marginBottom: "10px", fontSize: "13px" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "10px", fontWeight: 700, cursor: "pointer" }}>
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Main admin ─────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "#09090f", color: "#fff", padding: "32px 20px 60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 900, marginBottom: "20px" }}>SYS Vehicles Admin</h1>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0" }}>
          {[
            { key: "cars", label: "🚗 Listings", count: cars.length },
            { key: "enquiries", label: "📩 Enquiries", count: unreadCount || undefined },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key as "cars" | "enquiries")}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: view === tab.key ? "#fff" : "#64748b",
                fontSize: "14px", fontWeight: 700, padding: "10px 16px",
                borderBottom: view === tab.key ? "2px solid #dc2626" : "2px solid transparent",
                marginBottom: "-1px", display: "flex", alignItems: "center", gap: "6px",
                transition: "color 0.2s",
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span style={{ background: view === tab.key ? "#dc2626" : "#374151", color: "#fff", fontSize: "11px", fontWeight: 800, padding: "2px 7px", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Car Table ── */}
        {view === "enquiries" && (
          <div>
            {enquiries.length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", padding: "60px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                <p style={{ fontSize: "16px" }}>No enquiries yet.</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>When someone fills in the enquiry form, it'll show up here.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    style={{
                      background: enq.read ? "#111118" : "rgba(220,38,38,0.06)",
                      border: `1px solid ${enq.read ? "rgba(255,255,255,0.08)" : "rgba(220,38,38,0.25)"}`,
                      borderRadius: "12px", padding: "18px 20px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>{enq.name}</span>
                        {!enq.read && (
                          <span style={{ background: "#dc2626", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.05em" }}>NEW</span>
                        )}
                        {enq.car && (
                          <span style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "12px", padding: "2px 10px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            🚗 {enq.car}
                          </span>
                        )}
                      </div>
                      <span style={{ color: "#475569", fontSize: "12px" }}>
                        {new Date(enq.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
                      {enq.email && (
                        <a href={`mailto:${enq.email}`} style={{ color: "#dc2626", fontSize: "13px", textDecoration: "none" }}>✉ {enq.email}</a>
                      )}
                      {enq.phone && (
                        <a href={`tel:${enq.phone}`} style={{ color: "#dc2626", fontSize: "13px", textDecoration: "none" }}>📞 {enq.phone}</a>
                      )}
                    </div>

                    {enq.message && (
                      <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
                        "{enq.message}"
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "8px" }}>
                      {!enq.read && (
                        <button onClick={() => markRead(enq.id)}
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>
                          ✓ Mark as Read
                        </button>
                      )}
                      <button onClick={() => deleteEnquiry(enq.id)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "cars" && (<>
        <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", marginBottom: "30px" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                {["Car", "Year", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: "13px", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Thumbnail */}
                    <div style={{ width: "48px", height: "36px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#1a1a26" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(car.photoUrls?.[0] ?? car.photoUrl) || `https://images.unsplash.com/photo-${car.photoId}?w=100&q=60&auto=format`}
                        alt={`${car.make} ${car.model}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <span>{car.make} {car.model}</span>
                  </td>
                  <td style={{ padding: "12px" }}>{car.year}</td>
                  <td style={{ padding: "12px" }}>£{car.price.toLocaleString("en-GB")}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{car.status}</td>
                  <td style={{ padding: "12px" }}>
                    <div className="status-btns" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {(["available", "reserved", "sold"] as Car["status"][]).map((s) => (
                        <button key={s} onClick={() => updateStatus(car.id, s)}
                          style={{ background: car.status === s ? (s === "available" ? "#22c55e" : s === "reserved" ? "#f59e0b" : "#dc2626") : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", textTransform: "capitalize", fontSize: "12px" }}>
                          {s}
                        </button>
                      ))}
                      <button onClick={() => handleOpenEdit(car)}
                        style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => deleteCar(car.id)}
                        style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}>
                        🗑 Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Add Car Form ── */}
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Add New Car</h2>
          <form onSubmit={handleAddCar}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              {[
                { key: "make", label: "Make" },
                { key: "model", label: "Model" },
                { key: "year", label: "Year", type: "number" },
                { key: "price", label: "Price (£)", type: "number" },
                { key: "mileage", label: "Mileage (e.g. 45,000)" },
                { key: "fuel", label: "Fuel (Petrol / Diesel / Electric)" },
                { key: "transmission", label: "Transmission (Manual / Auto)" },
                { key: "color", label: "Colour" },
                { key: "badge", label: "Badge (optional, e.g. Sport)" },
              ].map((field) => (
                <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                  {field.label}
                  <input
                    required={field.key !== "badge"}
                    type={field.type ?? "text"}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              ))}
            </div>

            {/* ── Photo Upload Section ── */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "10px", fontWeight: 600 }}>
                Car Photos <span style={{ color: "#475569", fontWeight: 400 }}>— optional, add as many as you like</span>
              </p>

              {/* Upload button */}
              <label
                htmlFor="photo-upload"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.25)",
                  borderRadius: "8px", padding: "10px 18px", cursor: "pointer",
                  color: "#94a3b8", fontSize: "13px", marginBottom: "14px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLLabelElement).style.borderColor = "#dc2626";
                  (e.currentTarget as HTMLLabelElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(255,255,255,0.25)";
                  (e.currentTarget as HTMLLabelElement).style.color = "#94a3b8";
                }}
              >
                📷 Add Photos
              </label>
              <input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />

              {/* Preview grid */}
              {photoPreviews.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {photoPreviews.map((src, i) => (
                    <div key={i} style={{ position: "relative", width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {/* Main label */}
                      {i === 0 && (
                        <div style={{ position: "absolute", top: "5px", left: "5px", background: "#dc2626", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.05em" }}>
                          MAIN
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {/* Add more button */}
                  <label
                    htmlFor="photo-upload-more"
                    style={{ width: "120px", height: "90px", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", fontSize: "12px", gap: "4px" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#dc2626"; (e.currentTarget as HTMLLabelElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLLabelElement).style.color = "#64748b"; }}
                  >
                    <span style={{ fontSize: "20px" }}>+</span>
                    <span>Add more</span>
                  </label>
                  <input id="photo-upload-more" type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />
                </div>
              )}

              {photoPreviews.length === 0 && (
                <p style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>
                  First photo selected becomes the main listing image. No photo? A stock image is used.
                </p>
              )}
            </div>

            <button type="submit" style={{ background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              ＋ Add Car to Listing
            </button>
          </form>
        </div>
      </>)}
      </div>

      {/* ── Edit Modal ── */}
      {editingCar && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setEditingCar(null); }}
          className="modal-container"
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
        >
          <div className="modal-box" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Edit — {editingCar.year} {editingCar.make} {editingCar.model}</h2>
              <button onClick={() => setEditingCar(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Fields grid */}
              <div className="edit-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                {[
                  { key: "make", label: "Make" },
                  { key: "model", label: "Model" },
                  { key: "year", label: "Year", type: "number" },
                  { key: "price", label: "Price (£)", type: "number" },
                  { key: "mileage", label: "Mileage" },
                  { key: "fuel", label: "Fuel" },
                  { key: "transmission", label: "Transmission" },
                  { key: "color", label: "Colour" },
                  { key: "badge", label: "Badge (optional)" },
                ].map((field) => (
                  <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                    {field.label}
                    <input
                      required={field.key !== "badge"}
                      type={field.type ?? "text"}
                      value={editForm[field.key as keyof typeof editForm]}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </label>
                ))}
              </div>

              {/* Photos section */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "10px", fontWeight: 600 }}>
                  Photos <span style={{ color: "#475569", fontWeight: 400 }}>— first photo is the main listing image</span>
                </p>

                {/* Current photos grid */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                  {editPhotos.map((src, i) => (
                    <div key={i} style={{ position: "relative", width: "110px", height: "82px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {i === 0 && (
                        <div style={{ position: "absolute", top: "4px", left: "4px", background: "#dc2626", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 5px", borderRadius: "4px" }}>MAIN</div>
                      )}
                      <button type="button" onClick={() => removeEditPhoto(i)}
                        style={{ position: "absolute", top: "4px", right: "4px", width: "18px", height: "18px", borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ))}

                  {/* Add more */}
                  <label htmlFor="edit-photo-upload"
                    style={{ width: "110px", height: "82px", borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", fontSize: "12px", gap: "4px" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#dc2626"; (e.currentTarget as HTMLLabelElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLLabelElement).style.color = "#64748b"; }}
                  >
                    <span style={{ fontSize: "18px" }}>+</span>
                    <span>Add photo</span>
                  </label>
                  <input id="edit-photo-upload" type="file" accept="image/*" multiple onChange={handleEditPhotoUpload} style={{ display: "none" }} />
                </div>

                {editPhotos.length === 0 && (
                  <p style={{ fontSize: "11px", color: "#475569" }}>No photos uploaded — stock image will be shown.</p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit"
                  style={{ background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "10px 24px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingCar(null)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
