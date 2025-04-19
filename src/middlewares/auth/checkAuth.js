'use strict'

const permission = ( permission ) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
       return res.status(403).json({
        message: 'Permission denied'
      })     
    }

    console.log('permission::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      })     
    }

    return next()
  }
}

module.exports = {
  permission,
}