import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    
    return res.status(401).json({ message: "Token missing." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      
      return res.status(401).json({ message: "Invalid token." });
    }
    
    req.user = decoded;
    next();
  });
};