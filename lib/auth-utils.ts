import crypto from "crypto"

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "your-secret-key-change-in-production"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateToken(password: string): string {
  const timestamp = Date.now()
  const data = `${password}${timestamp}${SECRET_KEY}`
  const token = crypto.createHash("sha256").update(data).digest("hex")
  return `${token}.${timestamp}`
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [password, timestamp] = decoded.split(":")
    const tokenTimestamp = Number.parseInt(timestamp)
    const now = Date.now()
    const tokenAge = now - tokenTimestamp
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

    if (tokenAge > maxAge) {
      return false
    }

    return password === SECRET_KEY
  } catch (error) {
    console.log("[v0] Token verification error:", error)
    return false
  }
}
