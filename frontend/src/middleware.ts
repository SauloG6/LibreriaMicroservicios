import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/'];
  
  // Rutas de admin
  const adminRoutes = ['/admin'];
  
  // Rutas de usuario
  const userRoutes = ['/user', '/catalog', '/orders'];

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar el rol del usuario desde el token (decodificado)
  let userRole: string | null = null;
  
  try {
    // Decodificar el JWT para obtener el rol
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.role;
  } catch (error) {
    // Token inválido, redirigir a login
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar acceso a rutas de admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (userRole !== 'ADMINISTRADOR') {
      // Usuario no es admin, redirigir a su dashboard
      const userDashboard = new URL('/user/dashboard', request.url);
      return NextResponse.redirect(userDashboard);
    }
  }

  // Verificar acceso a rutas de usuario (excluir admin)
  if (userRoutes.some(route => pathname.startsWith(route))) {
    if (userRole === 'ADMINISTRADOR') {
      // Admin accediendo a ruta de usuario regular, permitir (admin puede ver todo)
      return NextResponse.next();
    }
  }

  // Redirigir a dashboard apropiado para ruta /dashboard genérica
  if (pathname === '/dashboard') {
    if (userRole === 'ADMINISTRADOR') {
      const adminDashboard = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(adminDashboard);
    } else {
      const userDashboard = new URL('/user/dashboard', request.url);
      return NextResponse.redirect(userDashboard);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
