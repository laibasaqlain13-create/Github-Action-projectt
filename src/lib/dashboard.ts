import { prisma } from './prisma';

export type RecentArtisan = {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  description: string;
};

export type DashboardData = {
  totalCustomers: number;
  totalArtisans: number;
  pendingApprovals: number;
  totalReviews: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  customerTickets: number;
  recentArtisans: RecentArtisan[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const [totalCustomers, totalArtisans, pendingApprovals, totalReviews, totalProducts, totalCategories, customerTickets, orders, artisans] =
    await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.artisan.count(),
      prisma.artisan.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.review.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.chat.count(),
      prisma.order.findMany({ select: { product: { select: { price: true } } } }),
      prisma.artisan.findMany({
        where: { verificationStatus: 'APPROVED' },
        orderBy: { id: 'desc' },
        take: 4,
        include: {
          artisanCategories: {
            include: { category: true },
          },
        },
      }),
    ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.product.price, 0);

  const recentArtisans = artisans.map((artisan) => {
    const city = artisan.address?.split(',')[0].trim() || 'Unknown';
    const categories = artisan.artisanCategories.map((item) => item.category.categoryName);
    return {
      id: artisan.id,
      name: artisan.businessName,
      city,
      category: categories.length ? categories[0] : 'Tailoring',
      rating: 5,
      description: artisan.bio ?? 'Experienced artisan providing custom services.',
    };
  });

  return {
    totalCustomers,
    totalArtisans,
    pendingApprovals,
    totalReviews,
    totalRevenue,
    totalProducts,
    totalCategories,
    customerTickets,
    recentArtisans,
  };
}
