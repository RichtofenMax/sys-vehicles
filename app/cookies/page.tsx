import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | SYS Vehicles",
};

export default function CookiePolicy() {
  return (
    <main style={{ background: "#09090f", minHeight: "100vh", color: "#fff", padding: "60px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "#dc2626", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← Back to SYS Vehicles
        </Link>

        <h1 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px" }}>Cookie Policy</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "40px" }}>Last updated: February 2026</p>

        {[
          {
            title: "1. What Are Cookies",
            body: "Cookies are small text files that are stored on your device when you visit a website. They help the website function properly and can store your preferences between visits.",
          },
          {
            title: "2. How We Use Cookies",
            body: "SYS Vehicles uses a minimal amount of browser storage. We use localStorage — a browser feature similar to cookies — to store vehicle listings that are added through our admin panel. This data is stored entirely on your own device and is not sent to any server or third party.",
          },
          {
            title: "3. Essential Storage",
            body: "The only browser storage we use is localStorage for vehicle data. This is essential for the website to display our current listings. It does not identify you personally and does not track your browsing behaviour.",
          },
          {
            title: "4. Third-Party Cookies",
            body: "Our website is hosted on Vercel. Vercel may set functional cookies related to their hosting infrastructure. We use Unsplash to display stock vehicle images where no photo has been uploaded — Unsplash may set their own cookies when images are loaded. We do not use any advertising or tracking cookies.",
          },
          {
            title: "5. Managing Cookies",
            body: "You can control and delete cookies through your browser settings. Please note that disabling cookies or localStorage may affect how vehicle listings display on our website. For guidance on managing cookies, visit allaboutcookies.org.",
          },
          {
            title: "6. Changes to This Policy",
            body: "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.",
          },
          {
            title: "7. Contact",
            body: "If you have any questions about our use of cookies, please contact us at Daniel@sysltd.net.",
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{section.title}</h2>
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.7 }}>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
