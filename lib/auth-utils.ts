import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

if (!SECRET_KEY || SECRET_KEY === "your-secret-key-change-in-production") {
  throw new Error(
    "❌ ADMIN_SECRET_KEY não está definida ou está usando o valor padrão. " +
      "Configure uma chave secreta forte e única no arquivo .env.local " +
      "para produção. Exemplo: openssl rand -hex 32",
  );
}

const secretKey = new TextEncoder().encode(SECRET_KEY);

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function generateToken(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
