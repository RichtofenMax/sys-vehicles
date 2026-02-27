import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SYS Vehicles",
};

export default function PrivacyPolicy() {
  return (
    <main style={{ background: "#09090f", minHeight: "100vh", color: "#fff", padding: "60px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "#dc2626", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← Back to SYS Vehicles
        </Link>

        <h1 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "40px" }}>Last updated: February 2026</p>

        {[
          {
            title: "1. Who We Are",
            body: "SYS Vehicles is a used car dealership based in Sheffield, UK. We are the data controller responsible for your personal information. For any privacy-related queries, please contact us at Daniel@sysltd.net.",
          },
          {
            title: "2. What Information We Collect",
            body: "When you submit an enquiry through our website, we collect your name, email address, phone number, and any message you provide. We do not collect payment details or sensitive personal data through this website.",
          },
          {
            title: "3. How We Use Your Information",
            body: "We use the information you provide solely to respond to your enquiry about a vehicle. We will not use your details for marketing purposes without your explicit consent, and we will not sell or share your data with third parties.",
          },
          {
            title: "4. How Long We Keep Your Data",
            body: "Enquiry data is retained for up to 12 months to allow us to follow up on your enquiry and maintain records of our correspondence. After this period, your data is securely deleted.",
          },
          {
            title: "5. Your Rights",
            body: "Under UK GDPR, you have the right to access, correct, or request deletion of your personal data. You can exercise these rights by contacting us at Daniel@sysltd.net. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.",
          },
          {
            title: "6. Website Analytics",
            body: "Our website does not currently use third-party analytics tools that track individual users. Basic server logs may be retained by our hosting provider (Vercel) in accordance with their own privacy policy.",
          },
          {
            title: "7. Contact Us",
            body: "If you have any questions about this Privacy Policy or how we handle your data, please email us at Daniel@sysltd.net.",
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
