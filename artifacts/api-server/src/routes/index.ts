import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import ordersRouter from "./orders";
import analyticsRouter from "./analytics";
import adminAuthRouter from "./adminAuthRoutes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(analyticsRouter);

export default router;
