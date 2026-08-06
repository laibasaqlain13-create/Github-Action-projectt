import ArtisanListings, { type CategoryArtisan } from "./ArtisanListings";
import { prisma } from "@/lib/prisma";
import { artisanProfiles } from "@/data/artisans";
import { categories } from "@/data/categories";

type CategoryPageProps = { params: { category: string } };

export default async function CategoriesPage({ params }: CategoryPageProps) {
  const fallbackCategory = categories.find((item) => item.route === params.category);
  const category = await prisma.category.findFirst({ where: { categorySlug: params.category } }).catch(() => null);
  const databaseArtisans = category ? await prisma.artisan.findMany({ where: { artisanCategories: { some: { categoryId: category.id } } }, include: { reviews: true } }).catch(() => []) : [];
  const artisans: CategoryArtisan[] = databaseArtisans.length ? databaseArtisans.map((artisan) => ({ id: artisan.id, name: artisan.fullName, city: artisan.address || "", rating: artisan.reviews.length ? artisan.reviews.reduce((total, review) => total + review.rating, 0) / artisan.reviews.length : 0, experience: artisan.experience, bio: artisan.bio || "", image: artisan.profileImage })) : artisanProfiles.filter((artisan) => artisan.category.toLowerCase() === (fallbackCategory?.name || category?.categoryName || "").toLowerCase()).map((artisan) => ({ id: artisan.id, name: artisan.name, city: artisan.city, rating: artisan.rating, experience: null, bio: artisan.description, image: artisan.image || null }));

  return <main className="min-h-screen bg-[#fdf7f5] py-16"><div className="mx-auto max-w-7xl px-6"><div className="mb-12 text-center"><h1 className="text-4xl font-bold text-[#7a1f52]">{category?.categoryName || fallbackCategory?.name || "Category"}</h1><p className="mt-3 text-gray-600">Find skilled artisans according to your craft needs.</p></div><ArtisanListings artisans={artisans} /></div></main>;
}
