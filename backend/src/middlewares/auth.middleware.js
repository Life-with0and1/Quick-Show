import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role !== "Admin") {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: "Unauthorized action" });
  }
};
