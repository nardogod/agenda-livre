import React, { useState, useEffect } from 'react';
import { X, Image, Clock, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Categories for the dropdown
const serviceCategories = [
  'Tranças',
  'Penteados',
  'Manutenção',
  'Cortes',
  'Tratamentos',
  'Coloração',
  'Outros'
];

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Nome do serviço é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  price: yup.number().positive('Preço deve ser positivo').required('Preço é obrigatório'),
  duration: yup.number().positive('Duração deve ser positiva').required('Duração é obrigatória'),
  category: yup.string().required('Categoria é obrigatória'),
  has_hair_option: yup.boolean(),
  hair_price_small: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().positive('Preço deve ser positivo').required('Preço para cabelo curto é obrigatório'),
    otherwise: yup.number().nullable()
  }),
  hair_price_medium: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().positive('Preço deve ser positivo').required('Preço para cabelo médio é obrigatório'),
    otherwise: yup.number().nullable()
  }),
  hair_price_large: yup.number().when('has_hair_option', {
    is: true,
    then: yup.number().positive('Preço deve ser positivo').required('Preço para cabelo longo é obrigatório'),
    otherwise: yup.number().nullable()
  }),
});

interface ServiceModalProps {
  service: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: any) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: service || {
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      has_hair_option: false,
      hair_price_small: '',
      hair_price_medium: '',
      hair_price_large: '',
      image: '',
    },
  });

  const hasHairOption = watch('has_hair_option');

  useEffect(() => {
    if (service) {
      reset(service);
      setSelectedImage(service.image);
    }
  }, [service, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server
      // For now, just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setValue('image', imageUrl);
    }
  };

  const onSubmit = (data: any) => {
    // Add the image URL to the data
    const serviceData = {
      ...data,
      image: selectedImage || '/api/placeholder/300/200',
    };
    onSave(serviceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Serviço
              </label>
              <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Image size={48} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                Clique na área acima para fazer upload de uma imagem
              </div>
            </div>

            {/* Service name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Serviço *
              </label>
              <input
                type="text"
                {...register('name')}
                className={`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Ex: Box Braids"
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register('category')}
                className={`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                  errors.category ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-red-500 text-xs">{errors.category.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className={`w-full p-3 pl-10 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-red-500 text-xs">{errors.price.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração (minutos) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  {...register('duration')}
                  className={`w-full p-3 pl-10 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                    errors.duration ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="60"
                />
              </div>
              {errors.duration && (
                <p className="mt-1 text-red-500 text-xs">{errors.duration.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                rows={3}
                {...register('description')}
                className={`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Descreva o serviço..."
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-xs">{errors.description.message}</p>
              )}
            </div>

            {/* Hair options toggle */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <label className="font-medium">Oferecer opção de cabelo</label>
                <div 
                  className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer ${
                    hasHairOption ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setValue('has_hair_option', !hasHairOption)}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transform duration-200 ${
                      hasHairOption ? 'translate-x-5' : 'translate-x-0'
                    }`} 
                  />
                </div>
                <input type="hidden" {...register('has_hair_option')} />
              </div>
            </div>

            {/* Hair prices (conditional) */}
            {hasHairOption && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Cabelo Curto (R$) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('hair_price_small')}
                      className={`w-full p-3 pl-10 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                        errors.hair_price_small ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.hair_price_small && (
                    <p className="mt-1 text-red-500 text-xs">{errors.hair_price_small.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Cabelo Médio (R$) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('hair_price_medium')}
                      className={`w-full p-3 pl-10 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                        errors.hair_price_medium ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.hair_price_medium && (
                    <p className="mt-1 text-red-500 text-xs">{errors.hair_price_medium.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Cabelo Longo (R$) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register('hair_price_large')}
                      className={`w-full p-3 pl-10 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none ${
                        errors.hair_price_large ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.hair_price_large && (
                    <p className="mt-1 text-red-500 text-xs">{errors.hair_price_large.message}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end mt-8 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              {service ? 'Salvar Alterações' : 'Criar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;