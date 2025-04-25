"use strict";

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    const validPermission = userRoles.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

module.exports = {
  permission,
};
