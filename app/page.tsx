"use client";

import { useState } from "react";
import {
  Shield,
  PoundSterling,
  RefreshCw,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Fuel,
  Gauge,
  Settings,
  Check,
} from "lucide-react";

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
  category: string[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CARS: Car[] = [
  {
    id: 1,
    make: "BMW",
    model: "3 Series M Sport",
    year: 2021,
    price: 21995,
    mileage: "34,000",
    fuel: "Petrol",
    transmission: "Automatic",
    color: "Black Sapphire",
    badge: "Hot Deal",
    photoId: "1555215695-3d98bc139570",
    category: ["all", "10k-20k"],
  },
  {
    id: 2,
    make: "Mercedes-Benz",
    model: "C-Class AMG Line",
    year: 2020,
    price: 18995,
    mileage: "42,000",
    fuel: "Diesel",
    transmission: "Automatic",
    color: "Polar White",
    badge: "Finance from £299/mo",
    photoId: "1606664515524-f6d6fc4b8e5e",
    category: ["all", "10k-20k"],
  },
  {
    id: 3,
    make: "Audi",
    model: "A4 S Line",
    year: 2022,
    price: 24495,
    mileage: "21,000",
    fuel: "Diesel",
    transmission: "Automatic",
    color: "Monsoon Grey",
    badge: "Nearly New",
    photoId: "1503376780353-7e6692767b70",
    category: ["all", "over20k"],
  },
  {
    id: 4,
    make: "Ford",
    model: "Mustang Mach-E",
    year: 2022,
    price: 29995,
    mileage: "18,000",
    fuel: "Electric",
    transmission: "Automatic",
    color: "Cyber Orange",
    badge: "Electric",
    photoId: "1558981806-ec527fa84c39",
    category: ["all", "over20k", "electric"],
  },
  {
    id: 5,
    make: "Volkswagen",
    model: "Golf GTI",
    year: 2021,
    price: 22995,
    mileage: "28,000",
    fuel: "Petrol",
    transmission: "Manual",
    color: "Tornado Red",
    badge: "",
    photoId: "1552519507-da3b142c7d7a",
    category: ["all", "over20k"],
  },
  {
    id: 6,
    make: "Range Rover",
    model: "Evoque R-Dynamic",
    year: 2021,
    price: 34995,
    mileage: "31,000",
    fuel: "Diesel",
    transmission: "Automatic",
    color: "Carpathian Grey",
    badge: "Premium",
    photoId: "1558618666-fcd25c85cd64",
    category: ["all", "over20k", "suv"],
  },
];

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

// ─── Sub-components ──────────────────────────────────────────────────────────

function CarCard({ car }: { car: Car }) {
  const [imgError, setImgError] = useState(false);
  const monthly = calcMonthly(car.price, 2000, 36);

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
          "0 8px 32px rgba(245,158,11,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px" }}>
        {!imgError ? (
          <img
            src={`https://images.unsplash.com/photo-${car.photoId}?w=500&q=65&auto=format`}
            alt={`${car.make} ${car.model}`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  : "rgba(245,158,11,0.9)",
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
            style={{ fontSize: "22px", fontWeight: 800, color: "#3b82f6" }}
          >
            {formatPrice(car.price)}
          </span>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            or from £{monthly}/mo · Rep. 6.9% APR
          </div>
        </div>

        <button
          style={{
            width: "100%",
            background: "#f59e0b",
            color: "#09090f",
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#d97706")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#f59e0b")
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SYSVehiclesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [carPrice, setCarPrice] = useState(20000);
  const [deposit, setDeposit] = useState(2000);
  const [term, setTerm] = useState(36);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    car: "",
    message: "",
  });

  const filteredCars =
    activeFilter === "all"
      ? CARS
      : activeFilter === "under10k"
      ? CARS.filter((c) => c.price < 10000)
      : activeFilter === "10k-20k"
      ? CARS.filter((c) => c.price >= 10000 && c.price <= 20000)
      : activeFilter === "over20k"
      ? CARS.filter((c) => c.price > 20000)
      : activeFilter === "electric"
      ? CARS.filter((c) => c.fuel === "Electric")
      : activeFilter === "suv"
      ? CARS.filter((c) => c.category.includes("suv"))
      : CARS;

  const monthly = calcMonthly(carPrice, deposit, term);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const navLinks = ["Cars", "Finance", "Part Exchange", "About", "Contact"];

  return (
    <div style={{ background: "#09090f", minHeight: "100vh" }}>
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
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#f59e0b",
              }}
            >
              SYS
            </span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#fff",
                marginLeft: "4px",
              }}
            >
              VEHICLES
            </span>
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
              href="tel:01142XXXXXX"
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
              <Phone size={14} style={{ color: "#f59e0b" }} />
              0114 XXX XXXX
            </a>
            <a
              href="#contact"
              style={{
                background: "#f59e0b",
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
                  "#d97706")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b")
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
                href="tel:01142XXXXXX"
                style={{
                  color: "#f59e0b",
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Phone size={16} /> 0114 XXX XXXX
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  background: "#f59e0b",
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
              "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)",
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
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
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
                background: "#f59e0b",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#f59e0b",
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
            <span style={{ display: "block", color: "#ffffff" }}>YOUR NEXT</span>
            <span
              style={{
                display: "block",
                background: "linear-gradient(90deg, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              GREAT DRIVE
            </span>
            <span style={{ display: "block", color: "#ffffff" }}>
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
            Finance available, part exchange welcome. Sheffield's honest, friendly
            dealer on Babur Road.
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
                background: "#f59e0b",
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
                  "#d97706";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              Browse Our Cars <ChevronRight size={16} />
            </a>
            <a
              href="#finance"
              style={{
                background: "transparent",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.5)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              Get Finance Quote
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
              { val: "0%", label: "Finance Available" },
              { val: "Free", label: "Part Exchange" },
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
                    color: "#f59e0b",
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
          <div
            style={{
              color: "#f59e0b",
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
              fontWeight: 900,
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
                    ? "#f59e0b"
                    : "rgba(255,255,255,0.1)",
                background:
                  activeFilter === f.key
                    ? "rgba(245,158,11,0.15)"
                    : "transparent",
                color: activeFilter === f.key ? "#f59e0b" : "#94a3b8",
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
            <a href="#contact" style={{ color: "#f59e0b" }}>
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
              <CarCard key={car.id} car={car} />
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
            <div
              style={{
                color: "#f59e0b",
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
                fontWeight: 900,
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
                icon: <Shield size={24} color="#f59e0b" />,
                title: "Exactly As Described",
                desc: "Every car is thoroughly inspected and listed honestly. Clean, well-maintained vehicles — no hidden surprises, no exaggeration.",
              },
              {
                icon: <PoundSterling size={24} color="#f59e0b" />,
                title: "Flexible Finance",
                desc: "Rates from 6.9% APR with decisions in minutes. We'll find a plan that works for you — straightforward, stress-free, same-day drive away.",
              },
              {
                icon: <RefreshCw size={24} color="#f59e0b" />,
                title: "Hassle-Free Part Exchange",
                desc: "Fair valuations and instant offers. We'll beat any written quote — no pressure, no haggling, just a smooth handover.",
              },
              {
                icon: <Star size={24} color="#f59e0b" />,
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
                    "rgba(245,158,11,0.3)";
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
                    background: "rgba(245,158,11,0.12)",
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

      {/* ── SECTION 5: Finance Calculator ────────────────────────────────── */}
      <section
        id="finance"
        style={{ padding: "96px 24px" }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div
              style={{
                color: "#f59e0b",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              HOW MUCH WILL IT COST?
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Finance Calculator
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "10px", fontSize: "15px" }}>
              Get an instant estimate — adjust the sliders to match your budget.
            </p>
          </div>

          {/* Calculator Card */}
          <div
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "36px",
            }}
          >
            {/* Car Price */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 600 }}>
                  Car Price
                </label>
                <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "16px" }}>
                  {formatPrice(carPrice)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={50000}
                step={500}
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                <span style={{ color: "#475569", fontSize: "11px" }}>£5,000</span>
                <span style={{ color: "#475569", fontSize: "11px" }}>£50,000</span>
              </div>
            </div>

            {/* Deposit */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 600 }}>
                  Deposit
                </label>
                <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "16px" }}>
                  {formatPrice(deposit)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={500}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                <span style={{ color: "#475569", fontSize: "11px" }}>£0</span>
                <span style={{ color: "#475569", fontSize: "11px" }}>£10,000</span>
              </div>
            </div>

            {/* Term */}
            <div style={{ marginBottom: "36px" }}>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Loan Term
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[24, 36, 48].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid",
                      borderColor:
                        term === t ? "#f59e0b" : "rgba(255,255,255,0.1)",
                      background:
                        term === t ? "rgba(245,158,11,0.15)" : "transparent",
                      color: term === t ? "#f59e0b" : "#94a3b8",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "14px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
                Estimated Monthly Payment
              </div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "#f59e0b",
                  letterSpacing: "-0.02em",
                }}
              >
                £{monthly}
              </div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "8px" }}>
                Representative APR: 6.9% · Based on {formatPrice(carPrice)} with{" "}
                {formatPrice(deposit)} deposit over {term} months
              </div>
            </div>

            <a
              href="#contact"
              style={{
                display: "block",
                width: "100%",
                background: "#f59e0b",
                color: "#09090f",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                textAlign: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#d97706")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "#f59e0b")
              }
            >
              Apply for Finance
            </a>
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
            <div
              style={{
                color: "#f59e0b",
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
                fontWeight: 900,
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
                  "Bought my BMW 3 Series from SYS and the whole process was completely stress-free. The car was immaculate — exactly as described online. Honest team, fair price, and I drove away same day. Wouldn't hesitate to recommend.",
                name: "Tariq M.",
                city: "Sheffield",
              },
              {
                quote:
                  "Wide variety of cars to choose from and the team really knew their stuff. They were friendly, not pushy at all, and communication was brilliant from start to finish. Got a great deal on my Range Rover — finance sorted in under 20 minutes.",
                name: "Sarah K.",
                city: "Rotherham",
              },
              {
                quote:
                  "Part-exchanged my old Golf and got a fair valuation without any back-and-forth. Everything was smooth and efficient. The car I picked up was spotless and in perfect condition — exactly what was advertised. Highly recommended.",
                name: "James W.",
                city: "Sheffield",
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
                    color: "#f59e0b",
                    opacity: 0.3,
                    fontWeight: 900,
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
                      fill="#f59e0b"
                      color="#f59e0b"
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
        </div>
      </section>

      {/* ── SECTION 7: Contact ────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{ padding: "96px 24px" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div
              style={{
                color: "#f59e0b",
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
                fontWeight: 900,
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
                      color: "#f59e0b",
                      border: "1px solid #f59e0b",
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
                            "rgba(245,158,11,0.5)")
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
                          "rgba(245,158,11,0.5)")
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
                      background: "#f59e0b",
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
                        "#d97706")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "#f59e0b")
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
                    icon: <MapPin size={16} color="#f59e0b" />,
                    lines: ["Babur Rd, Sheffield", "S4 7PY, United Kingdom"],
                  },
                  {
                    icon: <Phone size={16} color="#f59e0b" />,
                    lines: ["0114 XXX XXXX"],
                  },
                  {
                    icon: <Mail size={16} color="#f59e0b" />,
                    lines: ["info@sysvehicles.co.uk"],
                  },
                  {
                    icon: <Clock size={16} color="#f59e0b" />,
                    lines: [
                      "Mon–Fri: 9am – 6pm",
                      "Sat: 9am – 5pm",
                      "Sun: 10am – 4pm",
                    ],
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

                {/* Social icons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    { icon: <Facebook size={18} />, label: "Facebook" },
                    { icon: <Instagram size={18} />, label: "Instagram" },
                    { icon: <Twitter size={18} />, label: "Twitter" },
                    { icon: <ExternalLink size={18} />, label: "Google Reviews" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      title={s.label}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "rgba(245,158,11,0.15)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#f59e0b";
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "rgba(245,158,11,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#94a3b8";
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }}
                    >
                      {s.icon}
                    </button>
                  ))}
                </div>
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
                <MapPin size={36} color="#f59e0b" />
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
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "#f59e0b",
                }}
              >
                SYS
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "#fff",
                  marginLeft: "4px",
                }}
              >
                VEHICLES
              </span>
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
            {["Cars", "Finance", "Part Exchange", "About", "Contact"].map(
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
                      "#f59e0b")
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
              SYS Vehicles is a credit broker, not a lender. Representative APR
              6.9%. Finance is subject to status. Written quotations available on
              request.
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
