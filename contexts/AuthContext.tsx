// Redirecionamento automático para o componente canônico
// Este arquivo foi gerado automaticamente para resolver duplicações
export * from '../src/contexts/AuthContext';
export { default } from '../src/contexts/AuthContext';



/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
