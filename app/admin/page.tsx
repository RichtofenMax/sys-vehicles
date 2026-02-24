"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
  category: string[];
  status: "available" | "reserved" | "sold";
};

const STORAGE_KEY = "sys-cars";
const ADMIN_PASSWORD = "sysadmin2026";

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS as Car[]);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    color: "",
    badge: "",
  });

  useEffect(() => {
    if (!authenticated) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setCars(DEFAULT_CARS as Car[]);
      return;
    }

    try {
      setCars(JSON.parse(raw) as Car[]);
    } catch {
      setCars(DEFAULT_CARS as Car[]);
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  }, [authenticated, cars]);

  const nextId = useMemo(
    () => (cars.length ? Math.max(...cars.map((c) => c.id)) + 1 : 1),
    [cars]
  );

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
      return;
    }
    setError("Incorrect password");
  };

  const updateStatus = (id: number, status: Car["status"]) => {
    setCars((prev) => prev.map((car) => (car.id === id ? { ...car, status } : car)));
  };

  const deleteCar = (id: number) => {
    if (!confirm("Remove this car from the listing?")) return;
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  const handleAddCar = (e: FormEvent) => {
    e.preventDefault();

    const price = Number(formData.price);
    const year = Number(formData.year);
    const photoId = STARTER_PHOTO_IDS[(nextId - 1) % STARTER_PHOTO_IDS.length];

    const newCar: Car = {
      id: nextId,
      make: formData.make.trim(),
      model: formData.model.trim(),
      year,
      price,
      mileage: formData.mileage.trim(),
      fuel: formData.fuel.trim(),
      transmission: formData.transmission.trim(),
      color: formData.color.trim(),
      badge: formData.badge.trim(),
      photoId,
      category: buildCategory(price, formData.fuel.trim(), formData.model.trim()),
      status: "available",
    };

    setCars((prev) => [...prev, newCar]);
    setFormData({
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      fuel: "",
      transmission: "",
      color: "",
      badge: "",
    });
  };

  if (!authenticated) {
    return (
      <main style={{ minHeight: "100vh", background: "#09090f", color: "#fff", padding: "40px 24px" }}>
        <div style={{ maxWidth: "420px", margin: "60px auto", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>SYS Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", padding: "10px 12px", marginBottom: "12px" }}
            />
            {error && <p style={{ color: "#ef4444", marginBottom: "10px", fontSize: "13px" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "10px", fontWeight: 700, cursor: "pointer" }}>
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#09090f", color: "#fff", padding: "32px 20px 60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 900, marginBottom: "20px" }}>Vehicle Status Admin</h1>

        <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", marginBottom: "30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                <th style={{ textAlign: "left", padding: "12px" }}>Car</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Year</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Price</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "12px" }}>{car.make} {car.model}</td>
                  <td style={{ padding: "12px" }}>{car.year}</td>
                  <td style={{ padding: "12px" }}>£{car.price.toLocaleString("en-GB")}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{car.status}</td>
                  <td style={{ padding: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => updateStatus(car.id, "available")} style={{ background: car.status === "available" ? "#22c55e" : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>
                      Available
                    </button>
                    <button onClick={() => updateStatus(car.id, "reserved")} style={{ background: car.status === "reserved" ? "#f59e0b" : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>
                      Reserved
                    </button>
                    <button onClick={() => updateStatus(car.id, "sold")} style={{ background: car.status === "sold" ? "#dc2626" : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>
                      Sold
                    </button>
                    <button onClick={() => deleteCar(car.id)} style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", marginLeft: "4px" }}>
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "16px" }}>Add New Car</h2>
          <form onSubmit={handleAddCar} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {[
              { key: "make", label: "Make" },
              { key: "model", label: "Model" },
              { key: "year", label: "Year", type: "number" },
              { key: "price", label: "Price", type: "number" },
              { key: "mileage", label: "Mileage" },
              { key: "fuel", label: "Fuel" },
              { key: "transmission", label: "Transmission" },
              { key: "color", label: "Color" },
              { key: "badge", label: "Badge" },
            ].map((field) => (
              <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                {field.label}
                <input
                  required={field.key !== "badge"}
                  type={field.type ?? "text"}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "8px", padding: "10px 12px" }}
                />
              </label>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" style={{ background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
                Add Car
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
