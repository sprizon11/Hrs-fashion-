import { Router } from "express";
import { setAdminCookie, clearAdminCookie, isAdminAuthenticated } from "../middlewares/adminAuth";

const router = Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "admin123";

  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  setAdminCookie(res);
  res.json({ success: true });
});

router.post("/admin/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ success: true });
});

router.get("/admin/me", (req, res) => {
  res.json({ authenticated: isAdminAuthenticated(req) });
});

export default router;
