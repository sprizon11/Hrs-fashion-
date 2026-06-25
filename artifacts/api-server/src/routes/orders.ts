import { Router } from "express";
import { db, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";
import { randomUUID } from "crypto";

const router = Router();

router.post("/orders", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, city, items, notes } = req.body as {
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      address?: string;
      city?: string;
      notes?: string;
      items: Array<{ productId: string; productName: string; productImage: string; size: string; quantity: number; price: number }>;
    };

    const total = (items ?? []).reduce((s, i) => s + i.price * i.quantity, 0);
    const orderId = randomUUID();

    const [order] = await db.insert(ordersTable).values({
      id: orderId,
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? null,
      address: address ?? null,
      city: city ?? null,
      status: "pending",
      total,
      notes: notes ?? null,
    }).returning();

    if (items?.length) {
      await db.insert(orderItemsTable).values(
        items.map((item) => ({
          id: randomUUID(),
          orderId,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    }

    res.status(201).json(order);
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    const allItems = await db.select().from(orderItemsTable);
    const byOrder: Record<string, typeof allItems> = {};
    for (const item of allItems) {
      (byOrder[item.orderId] ??= []).push(item);
    }
    res.json(orders.map((o) => ({ ...o, items: byOrder[o.id] ?? [] })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, req.params.id));
    if (!order) { res.status(404).json({ error: "Not found" }); return; }
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, req.params.id));
    res.json({ ...order, items });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch order");
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.patch("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body as { status: string };
    const [updated] = await db.update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, req.params.id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
