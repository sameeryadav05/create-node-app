import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export function sendToken(userId: string) {
  const token = jwt.sign(
    { userId },         
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return token;
}

export function verifyToken(token: string): JwtPayload | false {
  try {
    const isValid = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return isValid;
  } catch (error) {
    return false;
  }
}
