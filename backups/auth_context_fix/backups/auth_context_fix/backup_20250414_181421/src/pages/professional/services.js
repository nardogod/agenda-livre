import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit, Trash, Clock, DollarSign, X, Camera, Info } from 'lucide-react';
import ProfessionalDashboardLayout from '../../components/layouts/ProfessionalDashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { professionalService } from '../../services/api';
import { useAuth } from '../../../../backups/auth_context_fix/backups/auth_context_fix/src/contexts/AuthContext.tsx';
import { useToast } from '../../contexts/ToastContext';

// Schema de validação para o formulário de serviço
const serviceSchema = yup.object({
  name: yup.string().required('Nome do serviço é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Preço é obrigatório')
    .positive('O preço deve ser positivo'),
  duration: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Duração é obrigatória')
    .positive('A duração deve ser positiva')
    .integer('A duração deve ser em minutos inteiros'),
  has_hair_option: yup.boolean(),
  hair_price_small: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('has_hair_option', {
      is: true,
      then: yup.number().required('Preço para cabelo curto é obrigatório').min(0),
    }),
  hair_price_medium: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('has_hair_option', {
      is: true,
      then: yup.number().required('Preço para cabelo médio é obrigatório').min(0),
    }),
  hair_price_large: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('has_hair_option', {
      is: true,
      then: yup.number().required('Preço para cabelo longo é obrigatório').min(0),
    }),
}).required();

// Componente de card de serviço
const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex w-full">
        {service.image ? (
          <div className="w-32 h-32 bg-gray-200 flex-shrink-0">
            <img 
              src={service.image} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center flex-shrink-0">
            <Camera size={24} className="text-gray-400" />
          </div>
        )}
        
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{service.description}</p>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                {service.duration} min
              </div>
              
              <div className="flex items-center text-gray-900 font-medium">
                <DollarSign size={16} className="mr-1" />
                R$ {service.price.toFixed(2)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(service)}
                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full"
                title="Editar serviço"
              >
                <Edit size={16} />
              </button>
              
              <button
                onClick={() => onDelete(service.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Excluir serviço"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {service.has_hair_option && (
        <div className="px-4 py-3 bg-purple-50 flex justify-between">
          <div className="flex items-center">
            <Info size={16} className="text-purple-600 mr-2" />
            <span className="text-sm text-purple-700">Opções de cabelo disponíveis</span>
          </div>
          <div className="text-sm">
            <span className="text-purple-700">
              De <span className="font-medium">R$ {service.hair_price_small.toFixed(2)}</span> a 
              <span className="font-medium"> R$ {service.hair_price_large.toFixed(2)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de modal para adicionar/editar serviço
const ServiceFormModal = ({ isOpen, onClose, service = null, onSubmit }) => {
  const isEditing = !!service;
  const defaultValues = service || {
    name: '',
    description: '',
    price: '',
    duration: '',
    has_hair_option: false,
    hair_price_small: '',
    hair_price_medium: '',
    hair_price_large: '',
    active: true,
  };
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues,
  });
  
  const hasHairOption = watch('has_hair_option');
  
  // Função para lidar com a submissão do formulário
  const handleFormSubmit = (data) => {
    // Converter strings para números
    data.price = Number(data.price);
    data.duration = Number(data.duration);
    
    if (data.has_hair_option) {
      data.hair_price_small = Number(data.hair_price_small);
      data.hair_price_medium = Number(data.hair_price_medium);
      data.hair_price_large = Number(data.hair_price_large);
    }
    
    onSubmit({
      ...(isEditing ? { id: service.id } : {}),
      ...data,
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-600 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do serviço
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Box Braids, Tranças, Penteado, etc."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  {...register("description")}
                  rows="3"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Descreva detalhes do serviço"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("price")}
                      className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (min)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      {...register("duration")}
                      className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      placeholder="60"
                    />
                  </div>
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_hair_option"
                      type="checkbox"
                      {...register("has_hair_option")}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_hair_option" className="font-medium text-gray-700">
                      Oferecer opção de cabelo
                    </label>
                    <p className="text-gray-500">
                      Habilite se você oferece diferentes preços para cabelo fornecido por você
                    </p>
                  </div>
                </div>
              </div>
              
              {hasHairOption && (
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-3">Preços por comprimento de cabelo</h4>
                  
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Curto (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("hair_price_small")}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                      {errors.hair_price_small && (
                        <p className="mt-1 text-sm text-red-500">{errors.hair_price_small.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Médio (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("hair_price_medium")}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                      {errors.hair_price_medium && (
                        <p className="mt-1 text-sm text-red-500">{errors.hair_price_medium.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longo (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("hair_price_large")}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                      {errors.hair_price_large && (
                        <p className="mt-1 text-sm text-red-500">{errors.hair_price_large.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {isEditing ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function ProfessionalServices() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  // Buscar os serviços do profissional
  const { data: services, isLoading } = useQuery(
    'professionalServices',
    () => professionalService.getServices(user.professional.id)
      .then(res => res.data)
      .catch(err => {
        showToast('Erro ao carregar serviços', 'error');
        throw err;
      }),
    {
      enabled: !!user?.professional?.id,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
  
  // Mutation para adicionar serviço
  const addMutation = useMutation(
    (serviceData) => professionalService.addService(user.professional.id, serviceData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professionalServices');
        showToast('Serviço adicionado com sucesso', 'success');
        setIsModalOpen(false);
      },
      onError: () => {
        showToast('Erro ao adicionar serviço', 'error');
      }
    }
  );
  
  // Mutation para atualizar serviço
  const updateMutation = useMutation(
    ({ id, ...serviceData }) => professionalService.updateService(id, serviceData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professionalServices');
        showToast('Serviço atualizado com sucesso', 'success');
        setIsModalOpen(false);
        setCurrentService(null);
      },
      onError: () => {
        showToast('Erro ao atualizar serviço', 'error');
      }
    }
  );
  
  // Mutation para excluir serviço
  const deleteMutation = useMutation(
    (serviceId) => professionalService.deleteService(serviceId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('professionalServices');
        showToast('Serviço excluído com sucesso', 'success');
      },
      onError: () => {
        showToast('Erro ao excluir serviço', 'error');
      }
    }
  );
  
  // Manipuladores de eventos
  const handleAddService = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };
  
  const handleEditService = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };
  
  const handleDeleteService = (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteMutation.mutate(serviceId);
    }
  };
  
  const handleFormSubmit = (data) => {
    if (currentService) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };
  
  // Renderização de estado de carregamento
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Meus Serviços</h1>
          <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
        </div>
        
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 flex">
              <div className="w-32 h-32 bg-gray-200 rounded-l-xl"></div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Meus Serviços</h1>
          <p className="text-gray-500">Gerencie os serviços que você oferece</p>
        </div>
        <button
          onClick={handleAddService}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={18} className="mr-2" />
          Novo Serviço
        </button>
      </div>
      
      {!services || services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Scissors className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sem serviços</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando seus serviços para que os clientes possam agendar.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus size={16} className="mr-2" />
              Adicionar Serviço
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
      
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentService(null);
        }}
        service={currentService}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

// Componente envolvendo a rota protegida
export default function ProfessionalServicesPage() {
  return (
    <ProtectedRoute professionalOnly>
      <ProfessionalDashboardLayout>
        <ProfessionalServices />
      </ProfessionalDashboardLayout>
    </ProtectedRoute>
  );
}