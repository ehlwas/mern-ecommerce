const jwt = require("jsonwebtoken");

const config = process.env;

const verifyCartToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token-cart"];

  if (!token) {
    return res.status(403).send("A cart token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.CART_TOKEN_SECRET_GUEST);
    req.cartData = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyCartToken;