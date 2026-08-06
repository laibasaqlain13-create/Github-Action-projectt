import { PrismaClient, UserRole, VerificationStatus, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean in correct order respecting FK constraints
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.artisanCategory.deleteMany();
  await prisma.artisan.deleteMany();
  await prisma.category.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin ──
  await prisma.user.create({
    data: {
      fullName: 'Admin',
      email: 'admin@marketplace.com',
      password: await bcrypt.hash('Admin@123', 12),
      phone: '+923001234567',
      role: UserRole.ADMIN,
    },
  });

  // ── Artisans ──
  const artisan1 = await prisma.artisan.create({
    data: {
      fullName: 'Sara Ahmed',
      email: 'sara.artisan@marketplace.com',
      password: await bcrypt.hash('Artisan@123', 12),
      phone: '+923001112233',
      businessName: 'Sara Couture',
      bio: 'Luxury bridal and custom tailoring studio with over 8 years of experience in handcrafted fashion.',
      experience: 8,
      address: 'Islamabad, Pakistan',
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  const artisan2 = await prisma.artisan.create({
    data: {
      fullName: 'Fatima Zafar',
      email: 'fatima.artisan@marketplace.com',
      password: await bcrypt.hash('Artisan@123', 12),
      phone: '+923007778899',
      businessName: 'Fatima Embroidery House',
      bio: 'Specializing in traditional embroidery and mirror work with 5 years of experience.',
      experience: 5,
      address: 'Lahore, Pakistan',
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  const artisan3 = await prisma.artisan.create({
    data: {
      fullName: 'Nadia Hussain',
      email: 'nadia.artisan@marketplace.com',
      password: await bcrypt.hash('Artisan@123', 12),
      phone: '+923009990011',
      businessName: 'Nadia Crochet Studio',
      bio: 'Expert crochet artisan creating beautiful handmade items since 2016.',
      experience: 7,
      address: 'Karachi, Pakistan',
      verificationStatus: VerificationStatus.APPROVED,
    },
  });

  // ── Customers ──
  const customer1 = await prisma.user.create({
    data: {
      fullName: 'Ayesha Khan',
      email: 'ayesha.customer@marketplace.com',
      password: await bcrypt.hash('Customer@123', 12),
      phone: '+923005556677',
      role: UserRole.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      fullName: 'Zainab Ali',
      email: 'zainab.customer@marketplace.com',
      password: await bcrypt.hash('Customer@123', 12),
      phone: '+923002223344',
      role: UserRole.CUSTOMER,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      fullName: 'Amina Noor',
      email: 'amina.customer@marketplace.com',
      password: await bcrypt.hash('Customer@123', 12),
      phone: '+923004445566',
      role: UserRole.CUSTOMER,
    },
  });

  // ── Categories ──
  await prisma.category.createMany({
    data: [
      { categoryName: 'Tailoring', categorySlug: 'tailoring', categoryIcon: '✂️', description: 'Custom tailoring services', status: 'ACTIVE' },
      { categoryName: 'Bridal Wear', categorySlug: 'bridal-wear', categoryIcon: '👰', description: 'Wedding and bridal outfits', status: 'ACTIVE' },
      { categoryName: 'Embroidery', categorySlug: 'embroidery', categoryIcon: '🪡', description: 'Embroidery and embellishments', status: 'ACTIVE' },
      { categoryName: 'Crochet', categorySlug: 'crochet', categoryIcon: '🧶', description: 'Handmade crochet items', status: 'ACTIVE' },
      { categoryName: 'Fabric Painting', categorySlug: 'fabric-painting', categoryIcon: '🎨', description: 'Fabric painting and artistry', status: 'ACTIVE' },
    ],
  });

  const cats = await prisma.category.findMany();
  const catMap = new Map(cats.map((c) => [c.categoryName, c.id]));

  // ── Artisan Categories ──
  await prisma.artisanCategory.createMany({
    data: [
      { artisanId: artisan1.id, categoryId: catMap.get('Tailoring')! },
      { artisanId: artisan1.id, categoryId: catMap.get('Bridal Wear')! },
      { artisanId: artisan1.id, categoryId: catMap.get('Embroidery')! },
      { artisanId: artisan2.id, categoryId: catMap.get('Embroidery')! },
      { artisanId: artisan2.id, categoryId: catMap.get('Fabric Painting')! },
      { artisanId: artisan3.id, categoryId: catMap.get('Crochet')! },
    ],
  });

  // ── Products ──
  const product1 = await prisma.product.create({
    data: {
      artisanId: artisan1.id,
      categoryId: catMap.get('Bridal Wear')!,
      productName: 'Bridal Lehenga',
      description: 'Custom bridal lehenga with intricate embroidery and premium fabric.',
      price: 25000,
      image: '/images/aplique.jpg',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      artisanId: artisan1.id,
      categoryId: catMap.get('Embroidery')!,
      productName: 'Embroidery Dupatta',
      description: 'Hand-embroidered dupatta with delicate floral patterns.',
      price: 5000,
      image: '/images/embroidery.jpg',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      artisanId: artisan1.id,
      categoryId: catMap.get('Tailoring')!,
      productName: 'Custom Shirt',
      description: 'Made-to-measure formal shirt with premium stitching.',
      price: 3500,
      image: '/images/salayi machine.jpg',
    },
  });

  const product4 = await prisma.product.create({
    data: {
      artisanId: artisan2.id,
      categoryId: catMap.get('Embroidery')!,
      productName: 'Hand Embroidered Kurta',
      description: 'Traditional hand-embroidered kurta with mirror work.',
      price: 4500,
      image: '/images/mirror work.jpg',
    },
  });

  const product5 = await prisma.product.create({
    data: {
      artisanId: artisan2.id,
      categoryId: catMap.get('Fabric Painting')!,
      productName: 'Fabric Painted Scarf',
      description: 'Hand-painted silk scarf with floral designs.',
      price: 2500,
      image: '/images/fabric painting.jpg',
    },
  });

  const product6 = await prisma.product.create({
    data: {
      artisanId: artisan3.id,
      categoryId: catMap.get('Crochet')!,
      productName: 'Crochet Baby Blanket',
      description: 'Soft handmade crochet baby blanket with pastel colors.',
      price: 3000,
      image: '/images/crochet.jpg',
    },
  });

  // ── Orders ──
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan1.id,
      productId: product1.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2024-12-15'),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      artisanId: artisan1.id,
      productId: product2.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2025-01-10'),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer3.id,
      artisanId: artisan1.id,
      productId: product3.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2025-02-20'),
    },
  });

  const order4 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan2.id,
      productId: product4.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2025-01-25'),
    },
  });

  const order5 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      artisanId: artisan2.id,
      productId: product5.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2025-02-15'),
    },
  });

  const order6 = await prisma.order.create({
    data: {
      customerId: customer3.id,
      artisanId: artisan3.id,
      productId: product6.id,
      status: OrderStatus.DELIVERED,
      orderDate: new Date('2025-03-01'),
    },
  });

  // More orders for testing - one non-delivered
  await prisma.order.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan1.id,
      productId: product2.id,
      status: OrderStatus.PROCESSING,
      orderDate: new Date('2025-03-05'),
    },
  });

  // ── Reviews (artisan-based, not order-based) ──
  await prisma.review.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan1.id,
      category: 'Bridal Wear',
      rating: 5,
      comment: 'Excellent craftsmanship and fast delivery. The bridal lehenga exceeded my expectations! Highly recommend Sara Couture.',
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      artisanId: artisan1.id,
      category: 'Embroidery',
      rating: 5,
      comment: 'Beautiful hand-embroidered dupatta with intricate details. The quality is outstanding and the colors are vibrant.',
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer3.id,
      artisanId: artisan1.id,
      category: 'Tailoring',
      rating: 4,
      comment: 'Great quality custom shirt with a perfect fit. The stitching is excellent. Would love to see more fabric options though.',
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan2.id,
      category: 'Embroidery',
      rating: 5,
      comment: 'The hand embroidered kurta is stunning! The mirror work is so detailed and beautiful. Will definitely order again.',
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      artisanId: artisan2.id,
      category: 'Fabric Painting',
      rating: 4,
      comment: 'Lovely hand-painted scarf, the colors are beautiful. Fast shipping and good packaging.',
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer3.id,
      artisanId: artisan3.id,
      category: 'Crochet',
      rating: 5,
      comment: 'The crochet baby blanket is absolutely gorgeous! So soft and well-made. Perfect gift for my niece.',
    },
  });

  // ── Chats ──
  await prisma.chat.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan1.id,
      messages: {
        create: {
          senderId: customer1.id,
          receiverId: artisan1.id,
          message: 'Hello Sara! Is the bridal lehenga still available? I would love to order one for my wedding.',
        },
      },
    },
  });

  await prisma.chat.create({
    data: {
      customerId: customer2.id,
      artisanId: artisan1.id,
      messages: {
        create: {
          senderId: customer2.id,
          receiverId: artisan1.id,
          message: 'Do you do custom embroidery designs? I have a specific pattern in mind.',
        },
      },
    },
  });

  await prisma.chat.create({
    data: {
      customerId: customer1.id,
      artisanId: artisan2.id,
      messages: {
        create: {
          senderId: customer1.id,
          receiverId: artisan2.id,
          message: 'Hi! I loved the embroidered kurta. Do you have any in blue color?',
        },
      },
    },
  });

  console.log('✅ Seed completed successfully with 3 artisans, 3 customers, 6 products, 7 orders, 6 reviews, and 3 chats.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
