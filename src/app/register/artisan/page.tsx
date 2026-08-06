"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArtisanRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [city, setCity] = useState("");
  const [craftCategory, setCraftCategory] = useState("Machine Stitching");
  const [businessName, setBusinessName] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !cnic.trim() || !city.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^\d{13}$/.test(cnic)) {
      setError("CNIC must be exactly 13 digits without dashes.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phone, role: "artisan", cnic, city, craftCategory, businessName, about }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Failed to create account.");
        return;
      }

      router.push("/register/success?role=artisan");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#FFF8F5] px-4 py-8">
      <div className="w-full max-w-3xl rounded-3xl border border-[#E9D9D1] bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#8B1E4D]">Artisan Registration</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Join HunarConnect to showcase and sell your handmade craft.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Full Name" value={fullName} onChange={setFullName} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email Address" type="email" value={email} onChange={setEmail} />
            <Field label="Phone Number" value={phone} onChange={setPhone} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            <Field label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="CNIC Number"
              value={cnic}
              onChange={(value) => setCnic(value.replace(/\D/g, "").slice(0, 13))}
            />
            <Field label="Business Name" value={businessName} onChange={setBusinessName} required={false} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileField label="CNIC Front Image" file={cnicFront} onChange={setCnicFront} />
            <FileField label="CNIC Back Image" file={cnicBack} onChange={setCnicBack} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" value={city} onChange={setCity} />
            <label className="block text-sm font-medium text-[#2D1F25]">
              Craft Category
              <select
                value={craftCategory}
                onChange={(event) => setCraftCategory(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]"
              >
                <option>Machine Stitching</option>
                <option>Embroidery</option>
                <option>Zardozi</option>
                <option>Applique</option>
                <option>Crochet</option>
                <option>Fabric Painting</option>
                <option>Mirror Work</option>
                <option>Lace Trims</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-[#2D1F25]">
            About Yourself
            <textarea
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#8B1E4D] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#73153F] disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Field({ label, type = "text", value, onChange, required = true }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-[#2D1F25]">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-[#E9D9D1] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B1E4D]"
      />
    </label>
  );
}

function FileField({ label, file, onChange }: { label: string; file: File | null; onChange: (file: File | null) => void }) {
  return (
    <label className="block text-sm font-medium text-[#2D1F25]">
      {label}
      <input
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="mt-1 block w-full text-sm text-[#6B7280]"
      />
      <span className="mt-1 block text-xs font-normal text-[#6B7280]">
        {file ? file.name : "JPG, JPEG or PNG only"}
      </span>
    </label>
  );
}
