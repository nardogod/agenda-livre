import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../../backups/auth_context_fix/backups/auth_context_fix/src/contexts/AuthContext.tsx';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

// Schema de validação
const schema = yup.object({
  first_name: yup.string().required('Nome é obrigatório'),
  last_name: yup.string().required('Sobrenome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  password: yup.string()
    .required('Senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  terms: yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos e condições')
}).required();

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('client'); // 'client' ou 'professional'
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (data) => {
    // Remover campo confirm_password antes de enviar
    const { confirm_password, ...userData } = data;
    
    // Adicionar o tipo de usuário
    userData.user_type = userType;
    
    const success = await register(userData);
    if (success) {
      router.push(userType === 'professional' ? '/professional/complete-profile' : '/');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-200 mb-3"></div>
          <div className="h-4 w-24 bg-purple-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">Crie sua conta</h1>
          <p className="text-gray-500">Junte-se à plataforma Agenda Livre</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          {/* Tipo de conta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de conta
            </label>
            <div className="flex bg-white rounded-xl overflow-hidden border border-gray-200">
              <button
                type="button"
                className={`flex-1 py-3 text-sm ${
                  userType === 'client' 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setUserType('client')}
              >
                Cliente
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-sm ${
                  userType === 'professional' 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setUserType('professional')}
              >
                Profissional
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome e Sobrenome */}
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...registerForm("first_name")}
                    className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    placeholder="Maria"
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sobrenome
                </label>
                <input
                  type="text"
                  {...registerForm("last_name")}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Silva"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...registerForm("email")}
                  className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...registerForm("phone")}
                  className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerForm("password")}
                  className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerForm("confirm_password")}
                  className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-500">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Termos e Condições */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  {...registerForm("terms")}
                  className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  Li e concordo com os{" "}
                  <Link href="/terms" className="text-purple-600 underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-purple-600 underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-purple-600 font-medium hover:text-purple-500">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )};