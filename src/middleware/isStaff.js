export const isStaff = (req, res, next) => {
    if (req.user && req.user.is_staff) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Staff only." });
    }
  };
  