"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Fuel,
  Gauge,
  Settings,
  Check,
} from "lucide-react";
import { DEFAULT_CARS } from "@/lib/cars-data";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  photoUrl?: string;    // legacy single
  photoUrls?: string[]; // multiple uploaded photos
  category: string[];
  status: "available" | "sold" | "reserved";
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "under10k", label: "Under £10k" },
  { key: "10k-20k", label: "£10k–£20k" },
  { key: "over20k", label: "Over £20k" },
  { key: "electric", label: "Electric" },
  { key: "suv", label: "SUV" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return "£" + n.toLocaleString("en-GB");
}

function calcMonthly(price: number, deposit: number, months: number) {
  return (((price - deposit) * 1.069) / months).toFixed(0);
}

const STORAGE_KEY = "sys-cars";

// ─── Sub-components ──────────────────────────────────────────────────────────

function CarCard({ car, onSelect }: { car: Car; onSelect: (car: Car) => void }) {
  const [imgError, setImgError] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const isUnavailable = car.status === "sold" || car.status === "reserved";
  const buttonLabel = car.status === "sold" ? "Sold" : car.status === "reserved" ? "Reserved" : "View Details";

  const photos: string[] = car.photoUrls?.length
    ? car.photoUrls
    : car.photoUrl
    ? [car.photoUrl]
    : [`https://images.unsplash.com/photo-${car.photoId}?w=500&q=65&auto=format`];
  const hasMultiple = photos.length > 1;

  return (
    <div
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "box-shadow 0.3s, transform 0.3s",
      }}
      className="group hover:-translate-y-1"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(220,38,38,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px" }}>
        {!imgError ? (
          <img
            src={photos[photoIndex]}
            alt={`${car.make} ${car.model} — photo ${photoIndex + 1}`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.15s" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1a1a26, #0f0f1e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              {car.make} {car.model}
            </span>
          </div>
        )}
        {car.badge && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background:
                car.badge === "Electric"
                  ? "#3b82f6"
                  : "rgba(220,38,38,0.9)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "999px",
              letterSpacing: "0.04em",
            }}
          >
            {car.badge}
          </span>
        )}
        {car.status !== "available" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: car.status === "sold" ? "#dc2626" : "#f59e0b",
                color: "#fff",
                fontWeight: 900,
                fontSize: "20px",
                padding: "8px 24px",
                borderRadius: "8px",
                letterSpacing: "0.08em",
              }}
            >
              {car.status === "sold" ? "SOLD" : "RESERVED"}
            </span>
          </div>
        )}

        {/* Gallery controls — only shown when multiple photos */}
        {hasMultiple && (
          <>
            {/* Prev / Next arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i - 1 + photos.length) % photos.length); }}
              style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >‹</button>
            <button
              onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => (i + 1) % photos.length); }}
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >›</button>
            {/* Dot indicators */}
            <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPhotoIndex(i); }}
                  style={{ width: i === photoIndex ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === photoIndex ? "#dc2626" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.2s, background 0.2s" }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px" }}>
        <div style={{ marginBottom: "4px" }}>
          <span style={{ fontWeight: 700, fontSize: "17px", color: "#fff" }}>
            {car.make} {car.model}
          </span>
        </div>
        <div
          style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}
        >
          {car.year} · {car.color}
        </div>

        {/* Spec pills */}
        <div
          style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}
        >
          {[
            { icon: <Gauge size={11} />, label: car.mileage + " mi" },
            { icon: <Fuel size={11} />, label: car.fuel },
            { icon: <Settings size={11} />, label: car.transmission },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                padding: "3px 10px",
                fontSize: "11px",
                color: "#94a3b8",
              }}
            >
              {s.icon} {s.label}
            </span>
          ))}
        </div>

        {/* Price */}
        <div style={{ marginBottom: "14px" }}>
          <span
            style={{ fontSize: "22px", fontWeight: 800, color: "#dc2626" }}
          >
            {formatPrice(car.price)}
          </span>
        </div>

        <button
          onClick={() => !isUnavailable && onSelect(car)}
          style={{
            width: "100%",
            background: "#dc2626",
            color: "#09090f",
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: isUnavailable ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            opacity: isUnavailable ? 0.4 : 1,
            pointerEvents: isUnavailable ? "none" : "auto",
          }}
          onMouseEnter={(e) =>
            !isUnavailable && ((e.currentTarget as HTMLButtonElement).style.background = "#b91c1c")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#dc2626")
          }
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Car Detail Modal ─────────────────────────────────────────────────────────

function CarModal({ car, onClose, onEnquire }: { car: Car; onClose: () => void; onEnquire: (carName: string) => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const photos: string[] = car.photoUrls?.length
    ? car.photoUrls
    : car.photoUrl
    ? [car.photoUrl]
    : [`https://images.unsplash.com/photo-${car.photoId}?w=900&q=80&auto=format`];

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const carName = `${car.year} ${car.make} ${car.model}`;

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#111118", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", width: "100%", maxWidth: "780px",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Image gallery */}
        <div style={{ position: "relative", height: "320px", borderRadius: "20px 20px 0 0", overflow: "hidden", background: "#0a0a0f" }}>
          {!imgError ? (
            <img
              src={photos[photoIndex]}
              alt={carName}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.15s" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#475569" }}>{carName}</span>
            </div>
          )}

          {/* Arrows */}
          {photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <button onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
              {/* Dots */}
              <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIndex(i)}
                    style={{ width: i === photoIndex ? "20px" : "7px", height: "7px", borderRadius: "4px", background: i === photoIndex ? "#dc2626" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.2s" }} />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div style={{ position: "absolute", bottom: "32px", left: "12px", display: "flex", gap: "6px" }}>
              {photos.map((src, i) => (
                <button key={i} onClick={() => setPhotoIndex(i)}
                  style={{ width: "52px", height: "40px", borderRadius: "6px", overflow: "hidden", border: i === photoIndex ? "2px solid #dc2626" : "2px solid transparent", cursor: "pointer", padding: 0, background: "transparent", opacity: i === photoIndex ? 1 : 0.6, transition: "opacity 0.2s, border-color 0.2s" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Close button */}
          <button onClick={onClose}
            style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

          {/* Status badge */}
          {car.status !== "available" && (
            <div style={{ position: "absolute", top: "12px", left: "12px", background: car.status === "sold" ? "#dc2626" : "#f59e0b", color: "#fff", fontWeight: 800, fontSize: "13px", padding: "4px 12px", borderRadius: "6px", letterSpacing: "0.06em" }}>
              {car.status === "sold" ? "SOLD" : "RESERVED"}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>{carName}</h2>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>{car.color}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#dc2626" }}>{formatPrice(car.price)}</div>
            </div>
          </div>

          {/* Specs grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
            {[
              { label: "Year", value: String(car.year) },
              { label: "Mileage", value: car.mileage + " mi" },
              { label: "Fuel", value: car.fuel },
              { label: "Transmission", value: car.transmission },
              { label: "Colour", value: car.color },
              ...(car.badge ? [{ label: "Badge", value: car.badge }] : []),
            ].map((spec) => (
              <div key={spec.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{spec.label}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {car.status === "available" ? (
            <button
              onClick={() => { onClose(); onEnquire(carName); }}
              style={{ width: "100%", background: "#dc2626", color: "#09090f", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "15px", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#b91c1c")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#dc2626")}
            >
              Enquire About This Car
            </button>
          ) : (
            <div style={{ textAlign: "center", color: "#64748b", fontSize: "14px", padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
              This vehicle is no longer available. <a href="#contact" onClick={onClose} style={{ color: "#dc2626" }}>Contact us</a> about similar cars.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SYSVehiclesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>(DEFAULT_CARS as Car[]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    car: "",
    message: "",
  });

  useEffect(() => {
    const savedCars = localStorage.getItem(STORAGE_KEY);
    if (!savedCars) {
      setCars(DEFAULT_CARS as Car[]);
      return;
    }

    try {
      const parsedCars = JSON.parse(savedCars) as Car[];
      setCars(parsedCars);
    } catch {
      setCars(DEFAULT_CARS as Car[]);
    }
  }, []);

  const filteredCars =
    activeFilter === "all"
      ? cars
      : activeFilter === "under10k"
      ? cars.filter((c) => c.price < 10000)
      : activeFilter === "10k-20k"
      ? cars.filter((c) => c.price >= 10000 && c.price <= 20000)
      : activeFilter === "over20k"
      ? cars.filter((c) => c.price > 20000)
      : activeFilter === "electric"
      ? cars.filter((c) => c.fuel === "Electric")
      : activeFilter === "suv"
      ? cars.filter((c) => c.category.includes("suv"))
      : cars;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleEnquire = (carName: string) => {
    setFormData((prev) => ({ ...prev, car: carName }));
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navLinks = ["Cars", "About", "Contact"];

  return (
    <div style={{ background: "#09090f", minHeight: "100vh" }}>
      {/* ── Car Detail Modal ── */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onEnquire={handleEnquire}
        />
      )}
      {/* ── SECTION 1: Navigation ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a href="#" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img
              src="/sys-logo.jpg"
              alt="SYS Automotives"
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
          </a>

          {/* Desktop Nav */}
          <div
            style={{ display: "flex", gap: "32px", alignItems: "center" }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#94a3b8")
                }
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right: Phone + CTA */}
          <div
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
            className="hidden md:flex"
          >
            <a
              href="tel:07427691258"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Phone size={14} style={{ color: "#dc2626" }} />
              07427 691258
            </a>
            <a
              href="#contact"
              style={{
                background: "#dc2626",
                color: "#09090f",
                padding: "8px 20px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#b91c1c")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#dc2626")
              }
            >
              Enquire Now
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "8px",
            }}
            className="md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              background: "rgba(9,9,15,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 24px 24px",
            }}
            className="md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  color: "#94a3b8",
                  textDecoration: "none",
                  padding: "12px 0",
                  fontSize: "16px",
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {link}
              </a>
            ))}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <a
                href="tel:07427691258"
                style={{
                  color: "#dc2626",
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Phone size={16} /> 07427 691258
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  background: "#dc2626",
                  color: "#09090f",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Enquire Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── SECTION 2: Hero ───────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "68px",
          background: "linear-gradient(160deg, #09090f 0%, #0f0f1e 100%)",
        }}
      >
        {/* Radial amber glow */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(201,165,81,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ display: "block", width: "32px", height: "1px", background: "#dc2626", marginBottom: "16px" }} />
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(201,165,81,0.1)",
              border: "1px solid rgba(201,165,81,0.2)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#dc2626",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#dc2626",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              SHEFFIELD'S TRUSTED DEALER
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 100px)",
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#ffffff",
                fontFamily: "\"Playfair Display\", serif",
                fontWeight: 700,
              }}
            >
              Your Next
            </span>
            <span
              style={{
                display: "block",
                background: "linear-gradient(90deg, #dc2626, #b91c1c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "\"Playfair Display\", serif",
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              Great Drive
            </span>
            <span
              style={{
                display: "block",
                color: "#ffffff",
                fontFamily: "\"DM Sans\", sans-serif",
                fontWeight: 300,
                letterSpacing: "0.12em",
                fontSize: "clamp(18px, 2.5vw, 32px)",
              }}
            >
              STARTS HERE
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(15px, 2vw, 19px)",
              maxWidth: "560px",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            Premium used cars — clean, well-maintained, and exactly as described.
            Sheffield's honest, friendly dealer on Babur Road.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "72px",
            }}
          >
            <a
              href="#cars"
              style={{
                background: "#dc2626",
                color: "#09090f",
                padding: "14px 32px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#b91c1c";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#dc2626";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              Browse Our Cars <ChevronRight size={16} />
            </a>
          </div>

          {/* Stats strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "14px",
              overflow: "hidden",
              maxWidth: "680px",
            }}
          >
            {[
              { val: "500+", label: "Cars Sold" },
              { val: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  padding: "18px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#dc2626",
                  }}
                >
                  {stat.val}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Featured Cars ──────────────────────────────────────── */}
      <section
        id="cars"
        style={{ padding: "96px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ display: "block", width: "28px", height: "1px", background: "#dc2626", margin: "0 auto 10px" }} />
          <div
            style={{
              color: "#dc2626",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            FEATURED VEHICLES
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontFamily: "\"Playfair Display\", serif",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Handpicked for You
          </h2>
          <p
            style={{
              color: "#94a3b8",
              marginTop: "12px",
              fontSize: "15px",
              maxWidth: "480px",
              margin: "12px auto 0",
            }}
          >
            Every car on our forecourt is clean, well-maintained, and exactly as
            described. No surprises.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid",
                borderColor:
                  activeFilter === f.key
                    ? "#dc2626"
                    : "rgba(255,255,255,0.1)",
                background:
                  activeFilter === f.key
                    ? "rgba(201,165,81,0.15)"
                    : "transparent",
                color: activeFilter === f.key ? "#dc2626" : "#94a3b8",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {filteredCars.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
              padding: "60px 0",
              fontSize: "15px",
            }}
          >
            No vehicles in this category currently. Check back soon or{" "}
            <a href="#contact" style={{ color: "#dc2626" }}>
              enquire directly
            </a>
            .
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onSelect={setSelectedCar} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 4: Why SYS Vehicles ──────────────────────────────────── */}
      <section
        id="about"
        style={{
          background: "#111118",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ display: "block", width: "28px", height: "1px", background: "#dc2626", margin: "0 auto 10px" }} />
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              WHY CHOOSE US
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "\"Playfair Display\", serif",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              The SYS Difference
            </h2>
            <p
              style={{
                color: "#94a3b8",
                marginTop: "12px",
                fontSize: "15px",
                maxWidth: "520px",
                margin: "12px auto 0",
              }}
            >
              Our customers come back because we do things right — every time.
            </p>
          </div>

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                icon: <Shield size={24} color="#dc2626" />,
                title: "Exactly As Described",
                desc: "Every car is thoroughly inspected and listed honestly. Clean, well-maintained vehicles — no hidden surprises, no exaggeration.",
              },
              {
                icon: <Star size={24} color="#dc2626" />,
                title: "Friendly, Knowledgeable Team",
                desc: "Clear communication from first enquiry to keys in hand. Our team knows their cars and is always happy to help without the pushy sales pitch.",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "28px",
                  backdropFilter: "blur(8px)",
                  transition: "border-color 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(201,165,81,0.3)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(201,165,81,0.12)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "16px",
                    marginBottom: "10px",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


            {/* ── SECTION 6: Testimonials ───────────────────────────────────────── */}
      <section
        style={{
          background: "#111118",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ display: "block", width: "28px", height: "1px", background: "#dc2626", margin: "0 auto 10px" }} />
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              CUSTOMER REVIEWS
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "\"Playfair Display\", serif",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              What Our Customers Say
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                quote:
                  "Stress free car buying, SYS kept me informed every step of the delivery process and the car is great.",
                name: "Mckenzie Collier",
                city: "Google Review",
              },
              {
                quote:
                  "I had an excellent experience with SYS Vehicles. From the very beginning, the team were professional, friendly, and transparent.",
                name: "Isaac Tesfay",
                city: "Google Review",
              },
              {
                quote:
                  "Very good car, no complaints and it came just as described.",
                name: "Sofonies Yohannes",
                city: "Google Review",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "28px",
                  position: "relative",
                }}
              >
                {/* Decorative quote mark */}
                <div
                  style={{
                    fontSize: "72px",
                    lineHeight: 0.8,
                    color: "#dc2626",
                    opacity: 0.3,
                    fontWeight: 900,
                    fontFamily: "\"Playfair Display\", serif",
                    marginBottom: "12px",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                  }}
                >
                  {t.quote}
                </p>
                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    gap: "3px",
                    marginBottom: "10px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill="#dc2626"
                      color="#dc2626"
                    />
                  ))}
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {t.name}
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: 400,
                      marginLeft: "6px",
                    }}
                  >
                    · {t.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a
              href="https://www.google.com/search?q=SYS+Vehicles+Ltd+reviews"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 20px",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,165,81,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8";
              }}
            >
              ⭐ View all reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Contact ────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{ padding: "96px 24px" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ display: "block", width: "28px", height: "1px", background: "#dc2626", margin: "0 auto 10px" }} />
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              GET IN TOUCH
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "\"Playfair Display\", serif",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Make an Enquiry
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "10px", fontSize: "15px" }}>
              Interested in a car? Have a question? We'll get back to you promptly.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* LEFT: Form */}
            <div
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "36px",
              }}
            >
              {formSubmitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Check size={28} color="#22c55e" />
                  </div>
                  <h3
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    Enquiry Sent!
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                    Thanks for reaching out. Our team will be in touch shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    style={{
                      marginTop: "24px",
                      background: "transparent",
                      color: "#dc2626",
                      border: "1px solid #dc2626",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    Enquiry Form
                  </h3>

                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "John Smith" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "john@example.com" },
                    { label: "Phone Number", key: "phone", type: "tel", placeholder: "07XXX XXXXXX" },
                    {
                      label: "Which car are you interested in?",
                      key: "car",
                      type: "text",
                      placeholder: "e.g. BMW 3 Series M Sport 2021",
                    },
                  ].map((field) => (
                    <div key={field.key} style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "13px",
                          fontWeight: 600,
                          marginBottom: "6px",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "10px",
                          padding: "11px 14px",
                          color: "#fff",
                          fontSize: "14px",
                          outline: "none",
                        }}
                        onFocus={(e) =>
                          ((e.currentTarget as HTMLInputElement).style.borderColor =
                            "rgba(201,165,81,0.5)")
                        }
                        onBlur={(e) =>
                          ((e.currentTarget as HTMLInputElement).style.borderColor =
                            "rgba(255,255,255,0.1)")
                        }
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        color: "#94a3b8",
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "6px",
                      }}
                    >
                      Message (optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Any questions or additional information..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) =>
                        ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                          "rgba(201,165,81,0.5)")
                      }
                      onBlur={(e) =>
                        ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                          "rgba(255,255,255,0.1)")
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      background: "#dc2626",
                      color: "#09090f",
                      border: "none",
                      borderRadius: "10px",
                      padding: "14px",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "#b91c1c")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "#dc2626")
                    }
                  >
                    Send Enquiry
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT: Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Contact details */}
              <div
                style={{
                  background: "#111118",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  Contact Information
                </h3>
                {[
                  {
                    icon: <MapPin size={16} color="#dc2626" />,
                    lines: ["Babur Rd, Sheffield", "S4 7PY, United Kingdom"],
                  },
                  {
                    icon: <Phone size={16} color="#dc2626" />,
                    lines: ["07427 691258"],
                  },
                  {
                    icon: <Mail size={16} color="#dc2626" />,
                    lines: ["Daniel@sysltd.net"],
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ flexShrink: 0, marginTop: "2px" }}>
                      {item.icon}
                    </div>
                    <div>
                      {item.lines.map((line) => (
                        <div
                          key={line}
                          style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6 }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                
              </div>

              {/* Map placeholder */}
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                  background:
                    "linear-gradient(135deg, #111118, #1a1a26)",
                }}
              >
                <MapPin size={36} color="#dc2626" />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "15px",
                      marginBottom: "4px",
                    }}
                  >
                    Visit Us in Sheffield
                  </div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>
                    Babur Rd, Sheffield, S4 7PY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#09090f",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "60px 24px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            paddingBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "12px" }}>
              <img
                src="/sys-logo.jpg"
                alt="SYS Automotives"
                style={{ height: "48px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.65 }}>
              Your trusted Sheffield car dealer. Clean, well-maintained cars —
              honest prices, no hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "16px",
                letterSpacing: "0.04em",
              }}
            >
              Quick Links
            </h4>
            {["Cars", "About", "Contact"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  style={{
                    display: "block",
                    color: "#64748b",
                    textDecoration: "none",
                    fontSize: "13px",
                    marginBottom: "8px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "#dc2626")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "#64748b")
                  }
                >
                  {link}
                </a>
              )
            )}
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "16px",
                letterSpacing: "0.04em",
              }}
            >
              Legal
            </h4>
            <p
              style={{
                color: "#64748b",
                fontSize: "12px",
                lineHeight: 1.7,
              }}
            >
              All vehicles are sold as seen. SYS Vehicles Ltd, Sheffield.
              Company registration available on request.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#475569", fontSize: "12px" }}>
            © 2026 SYS Vehicles. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Cookie Policy"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#475569",
                  fontSize: "12px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#475569")
                }
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
