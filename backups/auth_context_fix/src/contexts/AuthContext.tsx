// Redirecionamento automático para o componente canônico
// Este arquivo foi gerado automaticamente para resolver duplicações
export * from "..\..\backups\backups\backups\backups\backups\backup_20250414_181209\src\contexts\AuthContext";
export { default } from "..\..\backups\backups\backups\backups\backups\backup_20250414_181209\src\contexts\AuthContext";


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
