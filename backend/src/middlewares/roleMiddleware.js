// Middleware para autorización por roles
module.exports = function permitRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.roles) {
      return res.status(403).json({ message: 'No autorizado: sin roles' });
    }
    // user.roles puede ser array o string
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción' });
    }
    next();
  };
};
