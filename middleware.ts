import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth-middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos e API routes públicas que não sejam de admin (opcional, mas bom para performance)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Verifica rotas de admin
  if (pathname.startsWith("/admin")) {
    // Rotas públicas do admin
    if (pathname === "/admin/login") {
      const isAuthenticated = await checkAdminAuth(request);
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Todas as outras rotas /admin requerem autenticação
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Proteção para API rotas de admin (exceto auth)
  if (pathname.startsWith("/api/admin")) {
    const publicApiRoutes = ["/api/admin/auth", "/api/admin/logout"];
    
    if (!publicApiRoutes.includes(pathname)) {
      const isAuthenticated = await checkAdminAuth(request);
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
