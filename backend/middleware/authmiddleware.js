export const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu",
      redirect: "/login",
    });
  }
  next();
};
