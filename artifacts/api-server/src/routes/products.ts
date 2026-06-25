import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";
import { randomUUID } from "crypto";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const adminMode = req.query["admin"] === "true";
    const rows = adminMode
      ? await db.select().from(productsTable).orderBy(productsTable.createdAt)
      : await db.select().from(productsTable).where(eq(productsTable.isActive, true)).orderBy(productsTable.createdAt);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, req.params.id));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const d = req.body as Record<string, unknown>;
    const [created] = await db.insert(productsTable).values({
      id: (d["id"] as string) || randomUUID(),
      name: d["name"] as string,
      price: Number(d["price"]),
      originalPrice: d["originalPrice"] ? Number(d["originalPrice"]) : null,
      category: d["category"] as string,
      image: d["image"] as string,
      images: (d["images"] as string[]) ?? [],
      isNew: Boolean(d["isNew"]),
      isActive: true,
      description: d["description"] as string,
      details: (d["details"] as string[]) ?? [],
      sizes: (d["sizes"] as string[]) ?? [],
      stock: Number(d["stock"]) || 100,
    }).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const d = req.body as Record<string, unknown>;
    const [updated] = await db.update(productsTable).set({
      name: d["name"] as string,
      price: Number(d["price"]),
      originalPrice: d["originalPrice"] ? Number(d["originalPrice"]) : null,
      category: d["category"] as string,
      image: d["image"] as string,
      images: (d["images"] as string[]) ?? [],
      isNew: Boolean(d["isNew"]),
      isActive: d["isActive"] !== undefined ? Boolean(d["isActive"]) : true,
      description: d["description"] as string,
      details: (d["details"] as string[]) ?? [],
      sizes: (d["sizes"] as string[]) ?? [],
      stock: Number(d["stock"]) || 0,
      updatedAt: new Date(),
    }).where(eq(productsTable.id, req.params.id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    await db.update(productsTable).set({ isActive: false, updatedAt: new Date() }).where(eq(productsTable.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
