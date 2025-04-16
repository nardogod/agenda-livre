import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import ClientDashboardLayout from '../../components/layouts/ClientDashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';

// Schema de validação
const validateProfile = (data) => {
  const errors = {};
  
  if (!data.name) errors.name = 'Nome é obrigatório';
  if (!data.email) errors.email = 'Email é obrigatório';
  if (!data.phone) errors.phone = 'Telefone é obrigatório';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro deste campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const validation = validateProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simular atualização (em uma versão real, chamaríamos a API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em uma implementação real:
      // await updateProfile(formData);
      
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showToast('Erro ao atualizar perfil. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <ClientDashboardLayout>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }
  
  return (
    <ProtectedRoute userType="client">
      <ClientDashboardLayout>
        <div className="p-4 max-w-3xl mx-auto">
          <h1 className="text-2xl font-medium mb-6">Meu Perfil</h1>
          
          <div className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Informações Pessoais</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3 bg-white border ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl`}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3 bg-white border ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl`}
                      placeholder="Digite seu email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 w-full p-3 bg-white border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl`}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl"
                      placeholder="Digite seu endereço"
                    />
                  </div>
                </div>
                
                <div className="flex items-start pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="notifications"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifications" className="text-gray-700">
                      Desejo receber notificações sobre promoções e novidades
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-3 bg-purple-600 text-white font-medium rounded-xl ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl flex items-start">
            <AlertCircle size={20} className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Importante</h3>
              <p className="text-sm text-amber-700 mt-1">
                Para alterar sua senha, acesse a seção "Segurança" no menu lateral.
              </p>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;