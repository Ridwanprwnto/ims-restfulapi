export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || authHeader !== "Bearer valid-token") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};