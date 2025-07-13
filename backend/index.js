import express from "express";
import cors from "cors";
import "dotenv/config";
import dbConnect from "./src/config.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js";
import showRouter from "./src/routes/show.route.js";
import bookingRouter from "./src/routes/booking.routes.js";
import adminRouter from "./src/routes/admin.route.js";
import userRouter from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

await dbConnect();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.get("/", (req, res) => {
    res.send("Hi");
})
app.use('/api/inngest', serve({ client: inngest, functions }))

app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);


app.listen(PORT, () => {
    console.log("Sever is running on port:", PORT);
})