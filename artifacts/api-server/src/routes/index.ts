import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bypassRouter from "./bypass";
import statsRouter from "./stats";
import statusRouter from "./status";
import supportedRouter from "./supported";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bypassRouter);
router.use(statsRouter);
router.use(statusRouter);
router.use("/supported", supportedRouter);

export default router;
