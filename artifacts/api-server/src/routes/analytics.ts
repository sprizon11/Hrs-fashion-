import { Router } from "express";
import { db, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, gte, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router = Router();

router.get("/analytics/summary", requireAdmin, async (req, res) => {
  try {
    const [{ count: totalOrders }] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable);
    const [{ sum: totalRevenue }] = await db.select({ sum: sql<number>`coalesce(sum(total),0)` }).from(ordersTable);
    const [{ count: totalProducts }] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.isActive, true));

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const [{ sum: monthRevenue }] = await db.select({ sum: sql<number>`coalesce(sum(total),0)` }).from(ordersTable).where(gte(ordersTable.createdAt, startOfMonth));
    const [{ count: pendingOrders }] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable).where(eq(ordersTable.status, "pending"));

    res.json({
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      totalProducts: Number(totalProducts),
      monthRevenue: Number(monthRevenue),
      pendingOrders: Number(pendingOrders),
    });
  } catch (err) {
    req.log.error({ err }, "Analytics summary failed");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/analytics/revenue", requireAdmin, async (req, res) => {
  try {
    const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const rows = await db.select({
      month: sql<string>`to_char(created_at, 'YYYY-MM')`,
      revenue: sql<number>`sum(total)`,
      orders: sql<number>`count(*)`,
    }).from(ordersTable).where(gte(ordersTable.createdAt, since))
      .groupBy(sql`to_char(created_at, 'YYYY-MM')`)
      .orderBy(sql`to_char(created_at, 'YYYY-MM')`);

    res.json(rows.map((r) => ({ month: r.month, revenue: Number(r.revenue), orders: Number(r.orders) })));
  } catch (err) {
    req.log.error({ err }, "Revenue analytics failed");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/analytics/top-products", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select({
      productId: orderItemsTable.productId,
      productName: orderItemsTable.productName,
      productImage: orderItemsTable.productImage,
      totalSold: sql<number>`sum(quantity)`,
      totalRevenue: sql<number>`sum(price * quantity)`,
    }).from(orderItemsTable)
      .groupBy(orderItemsTable.productId, orderItemsTable.productName, orderItemsTable.productImage)
      .orderBy(desc(sql`sum(quantity)`))
      .limit(10);

    res.json(rows.map((r) => ({ ...r, totalSold: Number(r.totalSold), totalRevenue: Number(r.totalRevenue) })));
  } catch (err) {
    req.log.error({ err }, "Top products analytics failed");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/analytics/orders-by-status", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select({
      status: ordersTable.status,
      count: sql<number>`count(*)`,
    }).from(ordersTable).groupBy(ordersTable.status);
    res.json(rows.map((r) => ({ status: r.status, count: Number(r.count) })));
  } catch (err) {
    req.log.error({ err }, "Orders by status failed");
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
