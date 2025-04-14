// src/pages/dashboard/professional/services.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash, X, Clock, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { getProfessionalServices, createService, updateService, deleteService } from '../../../services/professionals';
import { Service } from '../../../types/service';

// Schema de validação do serviço
const serviceSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  price: yup.number().required('Preço é obrigatório').min(0, 'Preço deve ser maior ou igual a zero'),
  duration: yup.number().required('Duração é obrigatória').min(1, 'Duração deve ser maior que zero'),
  has_hair_option: yup.boolean(),
  hair_price_small: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().required('Preço para cabelo curto é obrigatório').min(0)
  }),
  hair_price_medium: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().required('Preço para cabelo médio é obrigatório').min(0)
  }),
  hair_price_large: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().required('Preço para cabelo longo é obrigatório').min(0)
  }),
  image: yup.mixed(),
  active: yup.boolean()
});

export default function ProfessionalServices() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      duration: 60,
      has_hair_option: false,
      hair_price_small: 0,
      hair_price_medium: 0,
      hair_price_large: 0,
      active: true
    }
  });
  
  const hasHairOption = watch('has_hair_option');
  
  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    } else if (user?.user_type !== 'professional') {
      router.push('/dashboard/client');
    }
  }, [isAuthenticated, user, router]);

  // Buscar serviços do profissional
  const { data: servicesData, isLoading } = useQuery(
    'professional-services',
    () => getProfessionalServices(user?.id || ''),
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Mutações
  const createServiceMutation = useMutation(
    (data: any) => createService(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professional-services');
        closeModal();
      }
    }
  );

  const updateServiceMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => updateService(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professional-services');
        closeModal();
      }
    }
  );

  const deleteServiceMutation = useMutation(
    (id: string) => deleteService(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professional-services');
      }
    }
  );

  // Abrir modal para adicionar serviço
  const openAddModal = () => {
    reset({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      has_hair_option: false,
      hair_price_small: 0,
      hair_price_medium: 0,
      hair_price_large: 0,
      active: true
    });
    setEditingService(null);
    setShowServiceModal(true);
  };

  // Abrir modal para editar serviço
  const openEditModal = (service: Service) => {
    reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      has_hair_option: !!service.has_hair_option,
      hair_price_small: service.hair_price_small || 0,
      hair_price_medium: service.hair_price_medium || 0,
      hair_price_large: service.hair_price_large || 0,
      active: service.active
    });
    setEditingService(service);
    setShowServiceModal(true);
  };

  // Fechar modal
  const closeModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
    reset();
  };

  // Excluir serviço
  const handleDeleteService = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteServiceMutation.mutate(id);
    }
  };

  // Submit do formulário
  const onSubmit = (data: any) => {
    // Preparar os dados para envio
    const formData = new FormData();
    
    for (const key in data) {
      if (key === 'image' && data[key][0]) {
        formData.append(key, data[key][0]);
      } else if (key !== 'image') {
        formData.append(key, String(data[key]));
      }
    }
    
    if (editingService) {
      updateServiceMutation.mutate({
        id: editingService.id,
        data: formData
      });
    } else {
      createServiceMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <ProfessionalDashboardLayout title="Meus Serviços">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ProfessionalDashboardLayout>
    );
  }

  const services = servicesData || [];

  return (
    <ProfessionalDashboardLayout title="Meus Serviços">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Gerencie os serviços que você oferece aos seus clientes.
        </p>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Adicionar serviço
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <Scissors size={48} className="text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Você ainda não tem serviços cadastrados
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione serviços para que os clientes possam agendar com você.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl"
            >
              Adicionar primeiro serviço
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
                        {service.image ? (
                          <img src={service.image} alt={service.name} className="h-10 w-10 object-cover" />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center">
                            <Scissors size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1.5 text-gray-400" />
                      {service.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <DollarSign size={16} className="mr-0.5 text-gray-400" />
                      {service.price.toFixed(2)}
                    </div>
                    {service.has_hair_option && (
                      <div className="text-xs text-gray-500 mt-1">
                        + cabelo (a partir de R$ {service.hair_price_small?.toFixed(2)})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                      service.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de adicionar/editar serviço */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium">
                {editingService ? 'Editar serviço' : 'Adicionar novo serviço'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do serviço*
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full p-3 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    placeholder="Ex: Box Braids"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição*
                  </label>
                  <textarea
                    {...register('description')}
                    className={`w-full p-3 border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl`}
                    rows={3}
                    placeholder="Descreva o serviço em detalhes..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (R$)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('price')}
                        className={`w-full pl-9 p-3 border ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        } rounded-xl`}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração (minutos)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        {...register('duration')}
                        className={`w-full pl-9 p-3 border ${
                          errors.duration ? 'border-red-300' : 'border-gray-300'
                        } rounded-xl`}
                      />
                    </div>
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem do serviço
                  </label>
                  <input
                    type="file"
                    {...register('image')}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                    accept="image/*"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recomendado: 600 x 400px, JPG ou PNG
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Opção de cabelo
                      </label>
                      <p className="text-xs text-gray-500">
                        Cliente pode escolher usar próprio cabelo ou comprar
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('has_hair_option', !hasHairOption)}
                      className="text-purple-600 focus:outline-none"
                    >
                      {hasHairOption ? (
                        <ToggleRight size={28} className="text-purple-600" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {hasHairOption && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-medium text-gray-700">Preços do cabelo por comprimento:</p>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-700 mb-1">
                            Curto (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register('hair_price_small')}
                            className={`w-full p-2 border ${
                              errors.hair_price_small ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg`}
                          />
                          {errors.hair_price_small && (
                            <p className="mt-1 text-xs text-red-600">{errors.hair_price_small.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-700 mb-1">
                            Médio (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register('hair_price_medium')}
                            className={`w-full p-2 border ${
                              errors.hair_price_medium ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg`}
                          />
                          {errors.hair_price_medium && (
                            <p className="mt-1 text-xs text-red-600">{errors.hair_price_medium.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-700 mb-1">
                            Longo (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register('hair_price_large')}
                            className={`w-full p-2 border ${
                              errors.hair_price_large ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg`}
                          />
                          {errors.hair_price_large && (
                            <p className="mt-1 text-xs text-red-600">{errors.hair_price_large.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    {...register('active')}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Serviço ativo e disponível para agendamento
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                  disabled={createServiceMutation.isLoading || updateServiceMutation.isLoading}
                >
                  {createServiceMutation.isLoading || updateServiceMutation.isLoading
                    ? 'Salvando...'
                    : editingService
                    ? 'Atualizar serviço'
                    : 'Adicionar serviço'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalDashboardLayout>
  );
}