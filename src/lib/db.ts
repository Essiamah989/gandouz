import { prisma } from "./prisma";
import fs from "fs";
import path from "path";

// Path to local mock database file
const MOCK_DB_PATH = path.join(process.cwd(), "src/lib/mock_db.json");

// Helper to read mock DB
function readMockDb(): any {
  try {
    if (!fs.existsSync(MOCK_DB_PATH)) {
      return { categories: [], brands: [], products: [], orders: [], settings: [], discountCodes: [] };
    }
    const data = fs.readFileSync(MOCK_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading mock DB:", error);
    return { categories: [], brands: [], products: [], orders: [], settings: [], discountCodes: [] };
  }
}

// Helper to write mock DB
function writeMockDb(data: any) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing mock DB:", error);
  }
}

// Check if actual DB is connected/configured
function isRealDbAvailable(): boolean {
  const url = process.env.DATABASE_URL || "";
  return url.length > 0 && !url.includes("YOUR_PROJECT");
}

/* ==========================================================================
   CATEGORY SERVICES
   ========================================================================== */
export async function getCategories() {
  if (isRealDbAvailable()) {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  return readMockDb().categories;
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string }) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.category.create({ data });
    } catch (e) {
      console.warn("DB insert failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const newCat = {
    id: `cat-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  db.categories.push(newCat);
  writeMockDb(db);
  return newCat;
}

/* ==========================================================================
   BRAND SERVICES
   ========================================================================== */
export async function getBrands() {
  if (isRealDbAvailable()) {
    try {
      return await prisma.brand.findMany({
        orderBy: { name: "asc" }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  return readMockDb().brands;
}

export async function createBrand(data: { name: string; slug: string; logo?: string; description?: string }) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.brand.create({ data });
    } catch (e) {
      console.warn("DB insert failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const newBrand = {
    id: `brand-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  db.brands.push(newBrand);
  writeMockDb(db);
  return newBrand;
}

/* ==========================================================================
   PRODUCT SERVICES
   ========================================================================== */
export async function getProducts(options: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
} = {}) {
  const { categorySlug, brandSlug, search, featuredOnly, limit } = options;

  if (isRealDbAvailable()) {
    try {
      const where: any = { isActive: true };
      if (categorySlug) {
        where.category = { slug: categorySlug };
      }
      if (brandSlug) {
        where.brand = { slug: brandSlug };
      }
      if (featuredOnly) {
        where.isFeatured = true;
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { tags: { has: search.toLowerCase() } }
        ];
      }

      const queryArgs: any = {
        where,
        include: { category: true, brand: true },
        orderBy: { createdAt: "desc" }
      };
      if (limit !== undefined) {
        queryArgs.take = limit;
      }
      return await prisma.product.findMany(queryArgs);
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }

  // MOCK FALLBACK
  const db = readMockDb();
  let filtered = [...db.products].filter(p => p.isActive !== false);

  if (categorySlug) {
    const category = db.categories.find((c: any) => c.slug === categorySlug);
    if (category) {
      filtered = filtered.filter(p => p.categoryId === category.id);
    } else {
      filtered = [];
    }
  }

  if (brandSlug) {
    const brand = db.brands.find((b: any) => b.slug === brandSlug);
    if (brand) {
      filtered = filtered.filter(p => p.brandId === brand.id);
    } else {
      filtered = [];
    }
  }

  if (featuredOnly) {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(s) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(s)))
    );
  }

  // Populate references
  filtered = filtered.map(p => ({
    ...p,
    category: db.categories.find((c: any) => c.id === p.categoryId),
    brand: db.brands.find((b: any) => b.id === p.brandId)
  }));

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.product.findUnique({
        where: { slug },
        include: { category: true, brand: true }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const product = db.products.find((p: any) => p.slug === slug);
  if (!product) return null;

  return {
    ...product,
    category: db.categories.find((c: any) => c.id === product.categoryId),
    brand: db.brands.find((b: any) => b.id === product.brandId)
  };
}

export async function getProductById(id: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: { category: true, brand: true }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const product = db.products.find((p: any) => p.id === id);
  if (!product) return null;

  return {
    ...product,
    category: db.categories.find((c: any) => c.id === product.categoryId),
    brand: db.brands.find((b: any) => b.id === product.brandId)
  };
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  images: string[];
  categoryId: string;
  brandId?: string;
  basePrice: number;
  salePrice?: number | null;
  isFeatured: boolean;
  loyaltyPoints?: number;
  tags?: string[];
  stock: number;
}) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          images: data.images,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          basePrice: data.basePrice,
          salePrice: data.salePrice,
          isFeatured: data.isFeatured,
          loyaltyPoints: data.loyaltyPoints || 0,
          tags: data.tags || [],
          stock: data.stock || 20
        }
      });
    } catch (e) {
      console.warn("DB insert failed, falling back to mock:", e);
    }
  }

  const db = readMockDb();
  const productId = `prod-${Date.now()}`;

  const newProduct = {
    id: productId,
    name: data.name,
    slug: data.slug,
    description: data.description,
    images: data.images,
    categoryId: data.categoryId,
    brandId: data.brandId,
    basePrice: data.basePrice,
    salePrice: data.salePrice || null,
    isFeatured: data.isFeatured,
    loyaltyPoints: data.loyaltyPoints || 0,
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stock: data.stock || 20
  };

  db.products.push(newProduct);
  writeMockDb(db);
  return newProduct;
}

export async function updateProduct(id: string, data: any) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          images: data.images,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          basePrice: data.basePrice,
          salePrice: data.salePrice,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          loyaltyPoints: data.loyaltyPoints || 0,
          tags: data.tags || [],
          stock: data.stock !== undefined ? data.stock : 20
        }
      });
    } catch (e) {
      console.warn("DB update failed, falling back to mock:", e);
    }
  }

  const db = readMockDb();
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index === -1) return null;


  db.products[index] = {
    ...db.products[index],
    name: data.name,
    slug: data.slug,
    description: data.description,
    images: data.images,
    categoryId: data.categoryId,
    brandId: data.brandId,
    basePrice: data.basePrice,
    salePrice: data.salePrice || null,
    isFeatured: data.isFeatured,
    isActive: data.isActive !== undefined ? data.isActive : true,
    loyaltyPoints: data.loyaltyPoints || 0,
    tags: data.tags || [],
    updatedAt: new Date().toISOString(),
    stock: data.stock !== undefined ? data.stock : 20
  };

  writeMockDb(db);
  return db.products[index];
}

export async function deleteProduct(id: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.product.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (e) {
      console.warn("DB delete failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.products[index].isActive = false;
    writeMockDb(db);
    return db.products[index];
  }
  return null;
}

/* ==========================================================================
   ORDER SERVICES
   ========================================================================== */
export async function getOrders() {
  if (isRealDbAvailable()) {
    try {
      return await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  return readMockDb().orders;
}

export async function getOrderById(id: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.order.findUnique({
        where: { id },
        include: { items: true, statusHistory: true }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  return db.orders.find((o: any) => o.id === id || o.orderNumber === id) || null;
}

export async function createOrder(data: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  items: Array<{
    productId: string;
    productName: string;
    unitPrice: number;
    qty: number;
    total: number;
  }>;
  userId?: string;
  pointsRedeemed?: number;
  promoCode?: string;
}) {
  const orderNumber = `GDZ-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  if (isRealDbAvailable()) {
    try {
      let finalUserId = data.userId || null;
      if (!finalUserId) {
        // Resolve or create user by email
        const nameParts = data.customerName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        let user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              clerkId: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              email: data.email,
              firstName,
              lastName,
              phone: data.phone
            }
          });
        }
        finalUserId = user.id;
      }

      // 1. Create the Order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          guestEmail: data.email,
          userId: finalUserId,
          status: "PENDING",
          subtotal: data.subtotal,
          discount: data.discount,
          shipping: data.shipping,
          total: data.total,
          notes: data.notes,
          pointsRedeemed: data.pointsRedeemed || 0,
          shippingAddress: {
            customerName: data.customerName,
            phone: data.phone,
            address: data.address,
            city: data.city
          },
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              qty: item.qty,
              total: item.total
            }))
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "Order created successfully"
            }
          }
        },
        include: { items: true }
      });

      // 2. Fetch User & Update Loyalty Balance
      if (finalUserId) {
        let loyaltyAcc = await prisma.loyaltyAccount.findUnique({ where: { userId: finalUserId } });
        if (!loyaltyAcc) {
          loyaltyAcc = await prisma.loyaltyAccount.create({
            data: {
              userId: finalUserId,
              balance: 0,
              lifetime: 0
            }
          });
        }

        // Deduct redeemed points
        if (data.pointsRedeemed && data.pointsRedeemed > 0) {
          await prisma.loyaltyAccount.update({
            where: { id: loyaltyAcc.id },
            data: {
              balance: { decrement: data.pointsRedeemed }
            }
          });

          await prisma.loyaltyTransaction.create({
            data: {
              accountId: loyaltyAcc.id,
              orderId: order.id,
              type: "REDEEM",
              amount: data.pointsRedeemed,
              description: `Redeemed ${data.pointsRedeemed} Cadopoints on order #${orderNumber}`
            }
          });
        }

        // Earn loyalty points based on products
        let earnedPoints = 0;
        for (const item of data.items) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          if (product && product.loyaltyPoints) {
            earnedPoints += product.loyaltyPoints * item.qty;
          }
        }

        if (earnedPoints > 0) {
          await prisma.loyaltyAccount.update({
            where: { id: loyaltyAcc.id },
            data: {
              balance: { increment: earnedPoints },
              lifetime: { increment: earnedPoints }
            }
          });

          await prisma.loyaltyTransaction.create({
            data: {
              accountId: loyaltyAcc.id,
              orderId: order.id,
              type: "EARN",
              amount: earnedPoints,
              description: `Earned ${earnedPoints} Cadopoints from order #${orderNumber}`
            }
          });
        }
      }

      // 3. Update Promo Code used count
      if (data.promoCode) {
        await prisma.discountCode.updateMany({
          where: { code: data.promoCode.toUpperCase() },
          data: { usedCount: { increment: 1 } }
        });
      }

      return order;
    } catch (e) {
      console.warn("DB insert failed, falling back to mock:", e);
    }
  }

  const db = readMockDb();
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName: data.customerName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    notes: data.notes || null,
    subtotal: data.subtotal,
    discount: data.discount,
    shipping: data.shipping,
    total: data.total,
    status: "PENDING" as const,
    cashCollected: false,
    pointsRedeemed: data.pointsRedeemed || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: data.items,
    statusHistory: [
      {
        status: "PENDING",
        note: "Order created successfully (mock database)",
        createdAt: new Date().toISOString(),
        createdBy: null
      }
    ]
  };

  db.orders.unshift(newOrder);
  writeMockDb(db);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: string, note?: string, createdBy?: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: {
          status: status as any,
          statusHistory: {
            create: {
              status: status as any,
              note,
              createdBy
            }
          }
        },
        include: { items: true, statusHistory: true }
      });
    } catch (e) {
      console.warn("DB update failed, falling back to mock:", e);
    }
  }

  const db = readMockDb();
  const index = db.orders.findIndex((o: any) => o.id === orderId);
  if (index !== -1) {
    const updatedHistory = [...(db.orders[index].statusHistory || [])];
    updatedHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      createdAt: new Date().toISOString(),
      createdBy: createdBy || null
    });

    db.orders[index].status = status;
    db.orders[index].statusHistory = updatedHistory;
    db.orders[index].updatedAt = new Date().toISOString();

    writeMockDb(db);
    return db.orders[index];
  }
  return null;
}

export async function markCashCollected(orderId: string, collected: boolean) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: { cashCollected: collected }
      });
    } catch (e) {
      console.warn("DB update failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const index = db.orders.findIndex((o: any) => o.id === orderId);
  if (index !== -1) {
    db.orders[index].cashCollected = collected;
    db.orders[index].updatedAt = new Date().toISOString();
    writeMockDb(db);
    return db.orders[index];
  }
  return null;
}

/* ==========================================================================
   SETTINGS SERVICES
   ========================================================================== */
export async function getSettings() {
  if (isRealDbAvailable()) {
    try {
      const dbSettings = await prisma.storeSetting.findMany();
      return dbSettings.reduce((acc: any, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  return readMockDb().settings.reduce((acc: any, s: any) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
}

export async function updateSetting(key: string, value: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    } catch (e) {
      console.warn("DB upsert failed, falling back to mock:", e);
    }
  }

  const db = readMockDb();
  const index = db.settings.findIndex((s: any) => s.key === key);
  if (index !== -1) {
    db.settings[index].value = value;
  } else {
    db.settings.push({ key, value });
  }
  writeMockDb(db);
  return { key, value };
}

/* ==========================================================================
   PROMOTIONS & DISCOUNT CODES
   ========================================================================== */
export async function getDiscountCodes() {
  if (isRealDbAvailable()) {
    try {
      return await prisma.discountCode.findMany({
        orderBy: { createdAt: "desc" }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  return readMockDb().discountCodes;
}

export async function getDiscountCodeByCode(code: string) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.discountCode.findUnique({
        where: { code: code.toUpperCase() }
      });
    } catch (e) {
      console.warn("DB query failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  return db.discountCodes.find((d: any) => d.code.toUpperCase() === code.toUpperCase() && d.isActive) || null;
}

export async function createDiscountCode(data: {
  code: string;
  type: string;
  value: number;
  minOrderValue?: number | null;
  maxUses?: number | null;
  isActive: boolean;
  expiresAt?: string | null;
}) {
  if (isRealDbAvailable()) {
    try {
      return await prisma.discountCode.create({
        data: {
          code: data.code.toUpperCase(),
          type: data.type as any,
          value: data.value,
          minOrderValue: data.minOrderValue,
          maxUses: data.maxUses,
          isActive: data.isActive,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
        }
      });
    } catch (e) {
      console.warn("DB insert failed, falling back to mock:", e);
    }
  }
  const db = readMockDb();
  const newCode = {
    id: `promo-${Date.now()}`,
    ...data,
    code: data.code.toUpperCase(),
    usedCount: 0,
    createdAt: new Date().toISOString()
  };
  db.discountCodes.push(newCode);
  writeMockDb(db);
  return newCode;
}

export async function getOrCreateUserFromClerk(clerkUser: any) {
  if (!isRealDbAvailable()) {
    return {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email: clerkUser.email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      phone: clerkUser.phone,
      loyaltyAcc: {
        balance: 35,
        transactions: [
          { id: "tx1", amount: 15, description: "Points earned from order #GDZ-123456", createdAt: new Date().toISOString() },
          { id: "tx2", amount: 20, description: "Manual Admin Reward", createdAt: new Date().toISOString() }
        ]
      }
    };
  }
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        loyaltyAcc: {
          include: {
            transactions: {
              orderBy: { createdAt: "desc" }
            }
          }
        }
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.email,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          phone: clerkUser.phone || "",
          loyaltyAcc: {
            create: {
              balance: 0,
              lifetime: 0
            }
          }
        },
        include: {
          loyaltyAcc: {
            include: {
              transactions: {
                orderBy: { createdAt: "desc" }
              }
            }
          }
        }
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getOrCreateUserFromClerk:", error);
    return null;
  }
}

export async function getOrCreateUserByEmail(email: string, customerName: string, phone: string) {
  if (!isRealDbAvailable()) {
    return { id: "mock-user-id" };
  }
  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        loyaltyAcc: true
      }
    });

    if (!user) {
      const nameParts = customerName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      user = await prisma.user.create({
        data: {
          clerkId: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          email,
          firstName,
          lastName,
          phone,
          loyaltyAcc: {
            create: {
              balance: 0,
              lifetime: 0
            }
          }
        },
        include: {
          loyaltyAcc: true
        }
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getOrCreateUserByEmail:", error);
    return null;
  }
}
