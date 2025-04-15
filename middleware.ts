// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Função que será executada em cada requisição
export function middleware(request: NextRequest) {
  // Obter o token do cookie
  const token = request.cookies.get('auth.token')?.value;
  
  // Obter o tipo de usuário do cookie (se existir)
  const userType = request.cookies.get('auth.userType')?.value;
  
  // Verificar se a rota é protegida
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/api/protected');

  // Se a rota for protegida e não houver token, redirecionar para o login
  if (isProtectedRoute && !token) {
    // Salvar a URL original para redirecionar de volta após o login
    const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
    
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', returnUrl);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Verificar rotas específicas de tipos de usuário
  if (token && userType) {
    // Verificação para rotas de profissional
    if (request.nextUrl.pathname.startsWith('/dashboard/professional') && userType !== 'professional') {
      return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }
    
    // Verificação para rotas de cliente
    if (request.nextUrl.pathname.startsWith('/dashboard/client') && userType !== 'client') {
      return NextResponse.redirect(new URL('/dashboard/professional', request.url));
    }
  }
  
  // Se a requisição chegou até aqui, continuar normalmente
  return NextResponse.next();
}

// Configurar em quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    // Rotas protegidas
    '/dashboard/:path*',
    '/api/protected/:path*',
    
    // Excluir arquivos estáticos e API pública
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ],
};