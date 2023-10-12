import { Router } from "../deps.ts";
import { userRoutes } from "./routes/users.ts";

const router = new Router();
userRoutes(router)

export default router;
