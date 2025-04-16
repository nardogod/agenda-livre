import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { register, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    type: 'client' // Por padrão, registrar como cliente
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Redirecionamento se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectTo = redirect ? decodeURIComponent(redirect) : '/dashboard/client';
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirect, router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro deste campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar telefone (formato simples)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    // Validar termos
    if (!agreeTerms) {
      newErrors.terms = 'Você deve concordar com os termos para continuar';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Remover confirmPassword antes de enviar para o servidor
      const { confirmPassword, ...dataToSend } = formData;
      
      const success = await register(dataToSend);
      
      if (success) {
        // Redirecionamento após registro bem-sucedido
        const redirectTo = redirect ? decodeURIComponent(redirect) : '/dashboard/client';
        router.push(redirectTo);
      } else {
        setErrors({ general: 'Não foi possível concluir o registro. Por favor, tente novamente.' });
      }
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setErrors({ general: 'Ocorreu um erro ao fazer o registro. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">Agenda Livre</h1>
        <h2 className="text-center text-xl font-medium text-gray-900">Crie sua conta</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
            entre em uma conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 flex items-center">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Tipo de Conta */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Conta
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div
                  className={`border ${
                    formData.type === 'client'
                      ? 'bg-purple-50 border-purple-500'
                      : 'border-gray-300 bg-white'
                  } rounded-xl p-3 flex items-center justify-center cursor-pointer`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'client' } })}
                >
                  <input
                    type="radio"
                    name="account-type"
                    className="sr-only"
                    checked={formData.type === 'client'}
                    onChange={() => {}}
                  />
                  <label className="cursor-pointer font-medium text-sm">
                    Cliente
                  </label>
                </div>
                <div
                  className={`border ${
                    formData.type === 'professional'
                      ? 'bg-purple-50 border-purple-500'
                      : 'border-gray-300 bg-white'
                  } rounded-xl p-3 flex items-center justify-center cursor-pointer`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'professional' } })}
                >
                  <input
                    type="radio"
                    name="account-type"
                    className="sr-only"
                    checked={formData.type === 'professional'}
                    onChange={() => {}}
                  />
                  <label className="cursor-pointer font-medium text-sm">
                    Profissional
                  </label>
                </div>
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className={`h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${
                    errors.terms ? 'border-red-300' : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Concordo com os{' '}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-500">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;