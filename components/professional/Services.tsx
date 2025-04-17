// components/professional/Services.tsx
import React, { useState } from 'react';
import { Edit, Trash, Plus, Clock, Home, X, Save } from 'lucide-react';

// Tipos
interface HairPrices {
  small: number;
  medium: number;
  large: number;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  active: boolean;
  hasHomeOption: boolean;
  hasHairOption: boolean;
  hairPrices?: HairPrices;
}

interface ServiceFormData {
  name: string;
  price: number;
  duration: number;
  description: string;
  active: boolean;
  hasHomeOption: boolean;
  hasHairOption: boolean;
  hairPrices: HairPrices;
}

const ProfessionalServices = () => {
  // Mock de serviços
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Box Braids',
      price: 250,
      duration: 180,
      description: 'Tranças estilo box braids com acabamento profissional',
      active: true,
      hasHomeOption: true,
      hasHairOption: true,
      hairPrices: {
        small: 60,
        medium: 80,
        large: 120,
      }
    },
    {
      id: 2,
      name: 'Twist Senegalês',
      price: 290,
      duration: 240,
      description: 'Tranças no estilo twist com finalização impecável',
      active: true,
      hasHomeOption: true,
      hasHairOption: true,
      hairPrices: {
        small: 70,
        medium: 90,
        large: 140,
      }
    },
    {
      id: 3,
      name: 'Penteado para Festa',
      price: 150,
      duration: 90,
      description: 'Penteados elaborados para eventos especiais',
      active: true,
      hasHomeOption: true,
      hasHairOption: false
    }
  ]);
  
  // Estado para o formulário de serviço (adição/edição)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    duration: 60,
    description: '',
    active: true,
    hasHomeOption: false,
    hasHairOption: false,
    hairPrices: {
      small: 0,
      medium: 0,
      large: 0,
    }
  });
  
  // Abrir formulário para adicionar novo serviço
  const openNewServiceForm = () => {
    setFormData({
      name: '',
      price: 0,
      duration: 60,
      description: '',
      active: true,
      hasHomeOption: false,
      hasHairOption: false,
      hairPrices: {
        small: 0,
        medium: 0,
        large: 0,
      }
    });
    setEditingServiceId(null);
    setIsFormOpen(true);
  };
  
  // Abrir formulário para editar serviço existente
  const openEditServiceForm = (service: Service) => {
    // Garantir que hairPrices exista, mesmo se o serviço não tiver esta opção
    const hairPrices = service.hairPrices || { small: 0, medium: 0, large: 0 };
    
    setFormData({
      ...service,
      hairPrices
    });
    setEditingServiceId(service.id);
    setIsFormOpen(true);
  };
  
  // Fechar formulário
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  // Gerenciar alterações no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name.startsWith('hairPrices.')) {
      const hairPriceField = name.split('.')[1] as keyof HairPrices;
      setFormData({
        ...formData,
        hairPrices: {
          ...formData.hairPrices,
          [hairPriceField]: parseFloat(value) || 0
        }
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Salvar serviço (novo ou editado)
  const saveService = () => {
    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      // Validação básica
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (editingServiceId) {
      // Atualizar serviço existente
      setServices(services.map(service => 
        service.id === editingServiceId ? { ...formData, id: editingServiceId } as Service : service
      ));
    } else {
      // Adicionar novo serviço
      const newId = Math.max(0, ...services.map(s => s.id)) + 1;
      setServices([...services, { ...formData, id: newId, active: true } as Service]);
    }
    
    // Fechar formulário
    setIsFormOpen(false);
  };
  
  // Remover serviço
  const removeService = (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este serviço?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };
  
  // Alternar status ativo/inativo
  const toggleServiceStatus = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };
  
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Serviços</h1>
        <button
          onClick={openNewServiceForm}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Adicionar serviço
        </button>
      </div>
      
      {/* Lista de serviços */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center">
            <p className="text-gray-500">Você ainda não adicionou nenhum serviço.</p>
            <button
              onClick={openNewServiceForm}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Adicionar seu primeiro serviço
            </button>
          </div>
        ) : (
          services.map(service => (
            <div 
              key={service.id} 
              className={`bg-white p-4 rounded-xl shadow-sm ${!service.active ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{service.name}</h3>
                    {!service.active && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Inativo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  
                  <div className="flex flex-wrap mt-2 space-x-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>{service.duration} min</span>
                    </div>
                    
                    {service.hasHomeOption && (
                      <div className="flex items-center text-xs text-purple-600">
                        <Home size={12} className="mr-1" />
                        <span>Disponível a domicílio</span>
                      </div>
                    )}
                  </div>
                  
                  {service.hasHairOption && service.hairPrices && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Opções de cabelo:</p>
                      <div className="flex space-x-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          Curto: +R$ {service.hairPrices.small.toFixed(2)}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          Médio: +R$ {service.hairPrices.medium.toFixed(2)}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          Longo: +R$ {service.hairPrices.large.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-purple-600">R$ {service.price.toFixed(2)}</div>
                  
                  <div className="flex mt-2 space-x-2">
                    <button 
                      onClick={() => openEditServiceForm(service)}
                      className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`p-1.5 ${service.active ? 'bg-amber-100 hover:bg-amber-200' : 'bg-green-100 hover:bg-green-200'} rounded transition-colors`}
                    >
                      <span className="text-xs font-medium">
                        {service.active ? 'Desativar' : 'Ativar'}
                      </span>
                    </button>
                    <button 
                      onClick={() => removeService(service.id)}
                      className="p-1.5 bg-red-100 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Formulário para adicionar/editar serviço */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeForm}
            ></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {editingServiceId ? 'Editar serviço' : 'Adicionar novo serviço'}
                </h3>
                <button 
                  onClick={closeForm}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Nome do serviço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do serviço *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    placeholder="Ex: Box Braids"
                    required
                  />
                </div>
                
                {/* Preço e duração */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço (R$) *
                    </label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração (min) *
                    </label>
                    <input 
                      type="number" 
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                      placeholder="60"
                      min="15"
                      step="15"
                      required
                    />
                  </div>
                </div>
                
                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    placeholder="Descrição do serviço..."
                    rows={3}
                  />
                </div>
                
                {/* Opções adicionais */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasHomeOption"
                      name="hasHomeOption"
                      checked={formData.hasHomeOption}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="hasHomeOption" className="ml-2 block text-sm text-gray-700">
                      Disponível para atendimento a domicílio
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasHairOption"
                      name="hasHairOption"
                      checked={formData.hasHairOption}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="hasHairOption" className="ml-2 block text-sm text-gray-700">
                      Opção de usar cabelo (com preço adicional)
                    </label>
                  </div>
                </div>
                
                {/* Preços do cabelo (condicional) */}
                {formData.hasHairOption && (
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <h4 className="text-sm font-medium">Preços adicionais por tamanho de cabelo</h4>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Curto (R$)
                        </label>
                        <input 
                          type="number" 
                          name="hairPrices.small"
                          value={formData.hairPrices.small}
                          onChange={handleChange}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Médio (R$)
                        </label>
                        <input 
                          type="number" 
                          name="hairPrices.medium"
                          value={formData.hairPrices.medium}
                          onChange={handleChange}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Longo (R$)
                        </label>
                        <input 
                          type="number" 
                          name="hairPrices.large"
                          value={formData.hairPrices.large}
                          onChange={handleChange}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveService}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Save size={16} className="mr-2" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalServices;