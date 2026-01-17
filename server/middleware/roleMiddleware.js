module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.toUpperCase())) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
