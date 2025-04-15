// src/pages/auth/register.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowLeft } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

// Schema de validação
const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  confirm_password: yup.string()
    .oneOf([yup.ref('password')], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  first_name: yup.string().required('Nome é obrigatório'),
  last_name: yup.string().required('Sobrenome é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  user_type: yup.string().oneOf(['client', 'professional']).required('Tipo de usuário é obrigatório')
});

export default function Register() {
  const router = useRouter();
  const { signUp, error: authError, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // React Hook Form
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      phone: '',
      user_type: 'client'
    }
  });

  const userType = watch('user_type');

  const onSubmit = async (data) => {
    try {
      await signUp(data);
      // Redirecionamento é feito no contexto de autenticação
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      // Erro já vai ser tratado pelo contexto de autenticação
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para a Home
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Criar uma conta</h1>
          <p className="text-gray-600 mt-2">
            Crie sua conta e comece a agendar serviços
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Tipo de usuário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Você é um:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-3 border rounded-xl cursor-pointer ${
                    userType === 'client' 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="client"
                      {...register('user_type')}
                      className="sr-only"
                    />
                    <span className={`flex-1 text-center font-medium ${
                      userType === 'client' ? 'text-purple-600' : 'text-gray-700'
                    }`}>
                      Cliente
                    </span>
                  </label>
                  
                  <label className={`flex items-center p-3 border rounded-xl cursor-pointer ${
                    userType === 'professional' 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="professional"
                      {...register('user_type')}
                      className="sr-only"
                    />
                    <span className={`flex-1 text-center font-medium ${
                      userType === 'professional' ? 'text-purple-600' : 'text-gray-700'
                    }`}>
                      Profissional
                    </span>
                  </label>
                </div>
                {errors.user_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_type.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('first_name')}
                      className={`w-full pl-10 p-3 border ${
                        errors.first_name ? 'border-red-300' : 'border-gray-300'
                      } rounded-xl`}
                      placeholder="Seu nome"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    {...register('last_name')}
                    className={`w-full p-3 border ${
                      errors.last_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="Seu sobrenome"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full pl-10 p-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full pl-10 p-3 border ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full pl-10 pr-10 p-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="********"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirm_password')}
                    className={`w-full pl-10 p-3 border ${
                      errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="********"
                  />
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  Concordo com os{' '}
                  <Link href="/terms" className="font-medium text-purple-600 hover:text-purple-800">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link href="/privacy" className="font-medium text-purple-600 hover:text-purple-800">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </div>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-800">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}