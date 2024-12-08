function checkRole(role) {
  return (req, res, next) => {
    if (req.cookies.role !== role) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
}

module.exports = checkRole;
