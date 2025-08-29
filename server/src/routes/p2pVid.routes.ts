import { Router } from "express";
import { p2pCallCreate } from "../controllers/p2pVid.controller.js";
//beaware of imports

const router = Router();

//routes part
router.get("/create/:id", p2pCallCreate);

export default router;
