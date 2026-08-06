import type { Metadata } from "next";
import ArtisanLayoutShell from "./components/ArtisanLayoutShell";

export const metadata: Metadata = {
  title: "Artisan Dashboard | HunarConnect",
  description: "Seller dashboard and product management for artisans on HunarConnect.",
};

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return <ArtisanLayoutShell>{children}</ArtisanLayoutShell>;
}
