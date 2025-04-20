// pages/dashboard/professional/profile.tsx
import React, { useState } from 'react';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
import { Camera, MapPin, Instagram, Shield, Save } from 'lucide-react';
import { professionalService } from '../../../services/professionals';

interface LocationData {
  zone: string;
  district: string;
  address: string;
}

interface ContactData {
  phone: string;
  email: string;
  instagram: string;
}

interface FormDataType {
  name: string;
  bio: string;
  specialties: string[];
  location: LocationData;
  contact: ContactData;
  offersHomeService: boolean;
  homeServiceFee: number;
}

const ProfessionalProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: 'Ana Oliveira',
    bio: 'Cabeleireira com mais de 10 anos de experiência em tranças e penteados afro. Especialista em Box Braids, Twists e técnicas de proteção capilar.',
    specialties: ['Tranças', 'Penteados', 'Dreads'],
    location: {
      zone: 'Zona Oeste',
      district: 'Pinheiros',
      address: 'Rua dos Pinheiros, 123'
    },
    contact: {
      phone: '11997778888',
      email: 'ana.oliveira@email.com',
      instagram: 'ana.tranças'
    },
    offersHomeService: true,
    homeServiceFee: 50
  });

  // Gerenciar alterações nos campos de formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // Verificar se o parent é uma chave válida do formData
      if (parent === 'location' || parent === 'contact') {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Adicionar/remover especialidade
  const toggleSpecialty = (specialty: string) => {
    const updatedSpecialties = formData.specialties.includes(specialty)
      ? formData.specialties.filter(s => s !== specialty)
      : [...formData.specialties, specialty];
    
    setFormData({
      ...formData,
      specialties: updatedSpecialties
    });
  };

  // Salvar perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Em um cenário real, enviaríamos os dados para a API
      await professionalService.updateProfile(formData);
      
      // Mostrar confirmação
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Ocorreu um erro ao atualizar seu perfil. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessionalDashboardLayout>
      <div className="px-4 py-6 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-gray-600">Atualize suas informações profissionais</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Fotos de perfil e capa */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Imagens do Perfil</h2>
            
            {/* Foto de capa */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de capa
              </label>
              <div className="h-32 bg-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-purple-600" />
                  <span className="mt-1 block text-sm font-medium text-purple-600">
                    Clique para fazer upload
                  </span>
                </div>
              </div>
            </div>
            
            {/* Foto de perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de perfil
              </label>
              <div className="flex items-center">
                <div className="h-24 w-24 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <label 
                    htmlFor="profile-upload"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Alterar foto
                  </label>
                  <input id="profile-upload" type="file" className="hidden" />
                  <p className="mt-1 text-xs text-gray-500">JPG ou PNG, max 2MB</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações básicas */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>
              
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografia profissional
                </label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  rows={4}
                />
              </div>
              
              {/* Especialidades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Tranças', 'Penteados', 'Dreads', 'Cachos', 'Maquiagem', 'Alongamento'].map(specialty => (
                    <label 
                      key={specialty}
                      className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                        formData.specialties.includes(specialty)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => toggleSpecialty(specialty)}
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Localização */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Localização</h2>
            
            <div className="space-y-4">
              {/* Zona */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zona
                </label>
                <select
                  name="location.zone"
                  value={formData.location.zone}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  required
                >
                  <option value="">Selecione a zona</option>
                  <option value="Zona Norte">Zona Norte</option>
                  <option value="Zona Sul">Zona Sul</option>
                  <option value="Zona Leste">Zona Leste</option>
                  <option value="Zona Oeste">Zona Oeste</option>
                  <option value="Centro">Centro</option>
                </select>
              </div>
              
              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <select
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  required
                >
                  <option value="">Selecione o bairro</option>
                  {formData.location.zone === "Zona Oeste" && (
                    <>
                      <option value="Pinheiros">Pinheiros</option>
                      <option value="Perdizes">Perdizes</option>
                      <option value="Lapa">Lapa</option>
                      <option value="Butantã">Butantã</option>
                    </>
                  )}
                  {formData.location.zone === "Zona Sul" && (
                    <>
                      <option value="Moema">Moema</option>
                      <option value="Vila Mariana">Vila Mariana</option>
                      <option value="Brooklin">Brooklin</option>
                      <option value="Santo Amaro">Santo Amaro</option>
                    </>
                  )}
                  {/* Adicionar bairros para outras zonas */}
                </select>
              </div>
              
              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço (não será exibido para clientes)
                </label>
                <input 
                  type="text" 
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="Rua, número, complemento"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Shield size={14} className="mr-1" /> 
                  Este endereço é mantido em sigilo
                </p>
              </div>
            </div>
          </div>
          
          {/* Serviço a Domicílio */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Serviço a Domicílio</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offersHomeService"
                  name="offersHomeService"
                  checked={formData.offersHomeService}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="offersHomeService" className="ml-2 block text-sm text-gray-700">
                  Ofereço serviço a domicílio
                </label>
              </div>
              
              {formData.offersHomeService && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de deslocamento (R$)
                  </label>
                  <input 
                    type="number" 
                    name="homeServiceFee"
                    value={formData.homeServiceFee}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    min="0"
                    step="5"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Informações de Contato */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Informações de Contato</h2>
            
            <div className="space-y-4">
              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone (WhatsApp)
                </label>
                <input 
                  type="tel" 
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram (opcional)
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Instagram size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contact.instagram"
                    value={formData.contact.instagram}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl"
                    placeholder="seuperfil"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Botão de Salvar */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} className="mr-2" />
              Salvar Alterações
              {loading && <span className="ml-2">...</span>}
            </button>
            
            {saved && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                Alterações salvas com sucesso!
              </div>
            )}
          </div>
        </form>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalProfilePage;