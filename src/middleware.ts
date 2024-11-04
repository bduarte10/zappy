import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = req.nextUrl.pathname === "/login";

  // Se não estiver autenticado e tentar acessar dashboard
  if (!isAuth && isOnDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se estiver autenticado e tentar acessar login
  if (isAuth && isOnLogin) {
    return NextResponse.redirect(
      new URL("/dashboard/disparo-em-massa", req.url)
    );
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
