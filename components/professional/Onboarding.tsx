// components/professional/Onboarding.tsx
import React, { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Camera, MapPin, Instagram, ShieldCheck, ArrowRight, Check, X, Clock, Home, Calendar } from 'lucide-react';

// Tipos
interface FormDataType {
  profileImage: File | null;
  coverImage: File | null;
  name: string;
  specialties: string[];
  location: string;
  zone: string;
  district: string;
  bio: string;
  instagram: string;
  phone: string;
  offersHomeService: boolean;
  homeServiceFee: number;
}

interface ServiceType {
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
}

interface ScheduleType {
  [key: string]: ScheduleDay;
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

interface DayNames {
  [key: string]: string;
}

// Componentes de UI
const MainButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}> = ({ children, onClick, disabled = false, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton: React.FC<{
  children: ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors ${className}`}
  >
    {children}
  </button>
);

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}> = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      className={`w-12 h-6 rounded-full flex items-center p-1 ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
      onClick={() => onChange(!enabled)}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => (
  <div className="flex mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className="flex-1 flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            i < currentStep ? 'bg-purple-600 text-white' : i === currentStep ? 'border-2 border-purple-600 text-purple-600' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {i < currentStep ? <Check size={16} /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`flex-1 h-0.5 ${i < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`}
          />
        )}
      </div>
    ))}
  </div>
);

const ProfessionalOnboarding: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    profileImage: null,
    coverImage: null,
    name: '',
    specialties: [],
    location: '',
    zone: '',
    district: '',
    bio: '',
    instagram: '',
    phone: '',
    offersHomeService: false,
    homeServiceFee: 0,
  });
  
  const [services, setServices] = useState<ServiceType[]>([
    { name: '', price: '', duration: '', description: '' }
  ]);
  
  const [schedule, setSchedule] = useState<ScheduleType>({
    monday: { active: false, start: '09:00', end: '18:00' },
    tuesday: { active: false, start: '09:00', end: '18:00' },
    wednesday: { active: false, start: '09:00', end: '18:00' },
    thursday: { active: false, start: '09:00', end: '18:00' },
    friday: { active: false, start: '09:00', end: '18:00' },
    saturday: { active: false, start: '09:00', end: '18:00' },
    sunday: { active: false, start: '09:00', end: '18:00' },
  });
  
  // Gerenciar alterações nos campos de formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Gerenciar alterações nos serviços
  const handleServiceChange = (index: number, field: keyof ServiceType, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };
  
  // Adicionar novo serviço
  const addService = () => {
    setServices([...services, { name: '', price: '', duration: '', description: '' }]);
  };
  
  // Remover serviço
  const removeService = (index: number) => {
    if (services.length <= 1) return;
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };
  
  // Gerenciar alterações na agenda
  const handleScheduleChange = (day: string, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };
  
  // Avançar para próximo passo
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  // Voltar para passo anterior
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  // Alterar para um passo específico
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
    window.scrollTo(0, 0);
  };
  
  // Submeter formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você faria a requisição para sua API
    try {
      // Mock de sucesso
      console.log('Dados enviados:', { ...formData, services, schedule });
      
      // Redirecionar para dashboard
      router.push('/dashboard/professional');
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error);
    }
  };
  
  // Toggler para especialidades
  const toggleSpecialty = (specialty: string) => {
    const updatedSpecialties = formData.specialties.includes(specialty)
      ? formData.specialties.filter(s => s !== specialty)
      : [...formData.specialties, specialty];
    
    setFormData({ ...formData, specialties: updatedSpecialties });
  };
  
  // Handle file uploads
  const handleFileChange = (name: 'profileImage' | 'coverImage', file: File | null) => {
    setFormData({
      ...formData,
      [name]: file
    });
  };
  
  // Renderizar passo de Perfil Básico
  const renderProfileStep = () => (
    <div>
      <h2 className="text-xl font-medium mb-6">Informações do Perfil</h2>
      
      <div className="space-y-6">
        {/* Foto de Perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Perfil
          </label>
          <div className="flex items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 mr-4">
              {formData.profileImage ? (
                <img 
                  src={URL.createObjectURL(formData.profileImage)} 
                  alt="Prévia da foto" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileChange('profileImage', files[0]);
                  }
                }}
              />
              <label 
                htmlFor="profileImage" 
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
              >
                Escolher foto
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Recomendado: 400x400px
              </p>
            </div>
          </div>
        </div>
        
        {/* Foto de Capa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Capa (opcional)
          </label>
          <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 mb-2">
            {formData.coverImage ? (
              <img 
                src={URL.createObjectURL(formData.coverImage)} 
                alt="Prévia da capa" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={24} className="text-gray-400" />
            )}
          </div>
          <div className="flex justify-center">
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFileChange('coverImage', files[0]);
                }
              }}
            />
            <label 
              htmlFor="coverImage" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
            >
              Escolher foto de capa
            </label>
          </div>
        </div>
        
        {/* Nome completo */}
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
            placeholder="Seu nome como profissional"
            required
          />
        </div>
        
        {/* Especialidades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especialidades
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
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
        
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sua biografia profissional
          </label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
            placeholder="Conte um pouco sobre sua experiência, formação e estilo de trabalho..."
            rows={4}
          />
        </div>
        
        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram (opcional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Instagram size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-3 bg-white border border-gray-200 rounded-xl"
              placeholder="@seuinstagram"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <MainButton 
          onClick={nextStep}
          disabled={!formData.name || !formData.profileImage || formData.specialties.length === 0}
        >
          Próximo passo <ArrowRight size={16} className="inline ml-2" />
        </MainButton>
        <Link href="/" className="block text-center mt-4 text-sm text-gray-500">
          Cancelar e voltar à página inicial
        </Link>
      </div>
    </div>
  );
  
  // Renderizar passo de Localização
  const renderLocationStep = () => (
    <div>
      <h2 className="text-xl font-medium mb-6">Onde você atua?</h2>
      
      <div className="space-y-6">
        {/* Zona */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona
          </label>
          <select
            name="zone"
            value={formData.zone}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bairro
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
            required
            disabled={!formData.zone}
          >
            <option value="">Selecione o bairro</option>
            {formData.zone === "Zona Sul" && (
              <>
                <option value="Moema">Moema</option>
                <option value="Vila Mariana">Vila Mariana</option>
                <option value="Brooklin">Brooklin</option>
                <option value="Santo Amaro">Santo Amaro</option>
                <option value="Jabaquara">Jabaquara</option>
              </>
            )}
            {formData.zone === "Zona Oeste" && (
              <>
                <option value="Pinheiros">Pinheiros</option>
                <option value="Perdizes">Perdizes</option>
                <option value="Lapa">Lapa</option>
                <option value="Butantã">Butantã</option>
              </>
            )}
            {/* Adicione mais bairros para outras zonas */}
          </select>
        </div>
        
        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço completo
          </label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
            placeholder="Rua, número, complemento"
            required
          />
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <ShieldCheck size={14} className="mr-1" />
            Este endereço não será exibido publicamente
          </p>
        </div>
        
        {/* Serviço a domicílio */}
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <ToggleSwitch
            enabled={formData.offersHomeService}
            onChange={(checked) => {
              setFormData({
                ...formData,
                offersHomeService: checked
              });
            }}
            label="Oferecer serviço a domicílio"
          />
          
          {formData.offersHomeService && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de deslocamento (R$)
              </label>
              <input 
                type="number" 
                name="homeServiceFee"
                value={formData.homeServiceFee}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <SecondaryButton onClick={prevStep}>
          Voltar
        </SecondaryButton>
        <MainButton 
          onClick={nextStep}
          disabled={!formData.zone || !formData.district || !formData.location}
        >
          Próximo passo <ArrowRight size={16} className="inline ml-2" />
        </MainButton>
      </div>
    </div>
  );
  
  // Renderizar passo de Serviços
  const renderServicesStep = () => (
    <div>
      <h2 className="text-xl font-medium mb-6">Adicione seus serviços</h2>
      
      <div className="space-y-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Serviço #{index + 1}</h3>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do serviço
                </label>
                <input 
                  type="text" 
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="Ex: Box Braids"
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input 
                    type="number" 
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (min)
                  </label>
                  <input 
                    type="number" 
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    placeholder="60"
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea 
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                  placeholder="Descrição do serviço..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addService}
          className="w-full py-3 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors flex items-center justify-center"
        >
          <span className="font-medium">Adicionar outro serviço</span>
        </button>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <SecondaryButton onClick={prevStep}>
          Voltar
        </SecondaryButton>
        <MainButton 
          onClick={nextStep}
          disabled={!services.some(s => s.name && s.price && s.duration)}
        >
          Próximo passo <ArrowRight size={16} className="inline ml-2" />
        </MainButton>
      </div>
    </div>
  );
  
  // Renderizar passo de Agenda
  const renderScheduleStep = () => {
    const dayNames: DayNames = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    
    return (
      <div>
        <h2 className="text-xl font-medium mb-6">Configure sua disponibilidade</h2>
        
        <div className="space-y-4">
          {Object.entries(schedule).map(([day, daySchedule]) => (
            <div key={day} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{dayNames[day]}</h3>
                <ToggleSwitch
                  enabled={daySchedule.active}
                  onChange={(checked) => handleScheduleChange(day, 'active', checked)}
                  label=""
                />
              </div>
              
              {daySchedule.active && (
                <div className="mt-4 flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Início
                    </label>
                    <input 
                      type="time" 
                      value={daySchedule.start}
                      onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Fim
                    </label>
                    <input 
                      type="time" 
                      value={daySchedule.end}
                      onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex space-x-4">
          <SecondaryButton onClick={prevStep}>
            Voltar
          </SecondaryButton>
          <MainButton 
            onClick={nextStep}
            disabled={!Object.values(schedule).some(day => day.active)}
          >
            Próximo passo <ArrowRight size={16} className="inline ml-2" />
          </MainButton>
        </div>
      </div>
    );
  };
  
  // Renderizar passo de Revisão
  const renderReviewStep = () => {
    const dayNames: DayNames = {
      monday: 'Segunda',
      tuesday: 'Terça',
      wednesday: 'Quarta',
      thursday: 'Quinta',
      friday: 'Sexta',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    
    return (
      <div>
        <h2 className="text-xl font-medium mb-6">Revisão e confirmação</h2>
        
        <div className="space-y-6">
          {/* Perfil */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Informações do perfil</h3>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-purple-600 text-sm"
              >
                Editar
              </button>
            </div>
            
            <div className="flex items-center">
              {formData.profileImage && (
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden mr-4">
                  <img 
                    src={URL.createObjectURL(formData.profileImage)} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <p className="font-medium">{formData.name}</p>
                <p className="text-sm text-gray-600">
                  {formData.specialties.join(', ')}
                </p>
              </div>
            </div>
            
            {formData.bio && (
              <p className="text-sm text-gray-600 mt-3">{formData.bio}</p>
            )}
          </div>
          
          {/* Localização */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Localização</h3>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="text-purple-600 text-sm"
              >
                Editar
              </button>
            </div>
            
            <div className="flex items-start">
              <MapPin size={18} className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm">{formData.location}</p>
                <p className="text-sm text-gray-600">{formData.district}, {formData.zone}</p>
              </div>
            </div>
            
            {formData.offersHomeService && (
              <div className="mt-3 flex items-center text-sm text-purple-700 bg-purple-50 py-1 px-2 rounded inline-flex">
                <Home size={14} className="mr-1" />
                <span>Atende a domicílio (R$ {formData.homeServiceFee.toFixed(2)})</span>
              </div>
            )}
          </div>
          
          {/* Serviços */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Serviços ({services.length})</h3>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="text-purple-600 text-sm"
              >
                Editar
              </button>
            </div>
            
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {service.duration} min
                    </p>
                  </div>
                  <p className="font-medium text-purple-600">R$ {parseFloat(service.price || "0").toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Agenda */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Disponibilidade</h3>
              <button
                type="button"
                onClick={() => goToStep(4)}
                className="text-purple-600 text-sm"
              >
                Editar
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(schedule).map(([day, daySchedule]) => {
                if (!daySchedule.active) return null;
                
                return (
                  <div key={day} className="text-sm">
                    <span className="font-medium">{dayNames[day]}: </span>
                    <span className="text-gray-600">{daySchedule.start} - {daySchedule.end}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <MainButton 
            type="submit"
            onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
          >
            Concluir cadastro
          </MainButton>
          
          <SecondaryButton onClick={prevStep}>
            Voltar
          </SecondaryButton>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Ao concluir, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto px-5">
        <div className="mb-6">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Agenda Livre
          </Link>
          <h1 className="text-2xl font-bold mt-4">Cadastro de Profissional</h1>
          <p className="text-gray-600 mt-1">Preencha as informações para criar seu perfil profissional</p>
        </div>
        
        <StepIndicator currentStep={step - 1} totalSteps={5} />
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderProfileStep()}
            {step === 2 && renderLocationStep()}
            {step === 3 && renderServicesStep()}
            {step === 4 && renderScheduleStep()}
            {step === 5 && renderReviewStep()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalOnboarding;