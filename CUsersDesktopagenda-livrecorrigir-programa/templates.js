// Template: PaymentMethod.tsx (Completo)
const PaymentMethodTemplate = `// src/components/booking/PaymentMethod.tsx
import React from 'react';

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethodProps {
  method: PaymentMethodOption;
  selected: boolean;
  onSelect: (id: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, selected, onSelect }) => {
  return (
    <button
      className={\`w-full p-4 mb-3 rounded-xl flex items-center \${
        selected ? "bg-purple-50 border-2 border-purple-600" : "bg-white border border-gray-200"
      }\`}
      onClick={() => onSelect(method.id)}
    >
      <div className={\`w-5 h-5 rounded-full border \${selected ? "border-2 border-purple-600" : "border border-gray-300"} flex items-center justify-center\`}>
        {selected && <div className="w-3 h-3 rounded-full bg-purple-600" />}
      </div>
      <div className="ml-3">
        <div className="font-medium">{method.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{method.description}</div>
      </div>
      {method.icon}
    </button>
  );
};

export default PaymentMethod;
`;

// Template: ClientForm.tsx
const ClientFormTemplate = `// src/components/booking/ClientForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
}

export interface ClientFormData {
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome completo *
        </label>
        <input 
          type="text" 
          className={\`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none \${
            errors.name ? 'border-red-500' : 'border-gray-200'
          }\`}
          placeholder="Digite seu nome" 
          {...register('name', { required: 'Nome é obrigatório' })}
        />
        {errors.name && (
          <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp *
        </label>
        <input 
          type="tel" 
          className={\`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none \${
            errors.phone ? 'border-red-500' : 'border-gray-200'
          }\`}
          placeholder="(11) 99999-9999" 
          {...register('phone', { 
            required: 'Telefone é obrigatório',
            pattern: {
              value: /^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$/,
              message: 'Formato de telefone inválido'
            }
          })}
        />
        {errors.phone && (
          <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-mail *
        </label>
        <input 
          type="email" 
          className={\`w-full p-3 bg-white border rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none \${
            errors.email ? 'border-red-500' : 'border-gray-200'
          }\`}
          placeholder="seu@email.com" 
          {...register('email', {
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea 
          className="w-full p-3 bg-white border border-gray-200 rounded-xl"
          rows={2}
          placeholder="Alguma observação para a profissional?" 
          {...register('notes')}
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
`;

// Template: DateSelector.tsx
const DateSelectorTemplate = `// src/components/booking/DateSelector.tsx
import React from 'react';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  onSelectDate, 
  daysToShow = 14 
}) => {
  const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const today = new Date();
  const dates = [];
  
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return (
    <div className="flex overflow-x-auto py-3 scrollbar-hide">
      {dates.map((date, idx) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        return (
          <button
            key={idx}
            className={\`flex flex-col items-center justify-center mr-4 w-12 h-16 rounded-xl \${
              isSelected ? "bg-purple-600 text-white" : "bg-white text-gray-700"
            }\`}
            onClick={() => onSelectDate(date)}
          >
            <span className="text-xs font-medium mb-1">{days[date.getDay()]}</span>
            <span className="text-lg font-semibold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;
`;

// Template: PaymentForm.tsx
const PaymentFormTemplate = `// src/components/booking/PaymentForm.tsx
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import PaymentMethod from './PaymentMethod';

interface PaymentFormProps {
  onPaymentSubmit: (paymentData: any) => void;
  totalAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSubmit, totalAmount }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const paymentMethods = [
    { 
      id: 'credit', 
      name: 'Cartão de Crédito', 
      description: 'Visa, MasterCard, Elo, Hipercard',
      icon: <CreditCard size={24} className="ml-auto text-gray-400" />
    },
    { 
      id: 'pix', 
      name: 'Pix', 
      description: 'Pagamento instantâneo',
      icon: <svg className="ml-auto w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    }
  ];

  const handleCardDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) return;
    
    const paymentData = selectedPaymentMethod === 'credit' 
      ? { method: 'credit', ...cardData }
      : { method: 'pix' };
    
    onPaymentSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-medium text-sm text-gray-500 mb-4">MÉTODO DE PAGAMENTO</h3>
      
      {paymentMethods.map(method => (
        <PaymentMethod 
          key={method.id}
          method={method}
          selected={selectedPaymentMethod === method.id}
          onSelect={setSelectedPaymentMethod}
        />
      ))}
      
      {selectedPaymentMethod === 'credit' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do cartão
            </label>
            <input 
              type="text" 
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardDataChange}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl"
              placeholder="0000 0000 0000 0000" 
            />
          </div>
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validade
              </label>
              <input 
                type="text" 
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleCardDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="MM/AA" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input 
                type="text" 
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardDataChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                placeholder="123" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome no cartão
            </label>
            <input 
              type="text" 
              name="cardName"
              value={cardData.cardName}
              onChange={handleCardDataChange}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl"
              placeholder="Como está impresso no cartão" 
            />
          </div>
        </div>
      )}
      
      {selectedPaymentMethod === 'pix' && (
        <div className="mt-6 text-center">
          <div className="bg-white p-4 rounded-xl inline-flex mx-auto">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <path d="M10 10h10v10h-10zM30 10h10v10h-10zM50 10h10v10h-10zM70 10h10v10h-10zM20 20h10v10h-10zM40 20h10v10h-10zM60 20h10v10h-10zM80 20h10v10h-10z" fill="black" />
              {/* Este é um QR Code simplificado para ilustração */}
            </svg>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Escaneie o QR Code acima ou copie o código PIX abaixo:
          </p>
          <div className="mt-2 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate">00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-g7h8...</span>
            <button type="button" className="text-purple-600 text-xs font-medium">Copiar</button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Após o pagamento, seu agendamento será confirmado automaticamente.
          </p>
        </div>
      )}
      
      <div className="mt-6 px-3 py-4 bg-amber-50 rounded-xl flex">
        <svg className="flex-shrink-0 w-5 h-5 text-amber-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p className="text-xs text-amber-700">
          A confirmação da reserva depende da aprovação do pagamento. Você receberá um email com todos os detalhes do seu agendamento.
        </p>
      </div>
      
      <button 
        type="submit"
        className={\`w-full py-3 text-white font-medium rounded-xl mt-6 \${
          selectedPaymentMethod ? "bg-purple-600" : "bg-gray-300"
        }\`}
        disabled={!selectedPaymentMethod}
      >
        {selectedPaymentMethod === 'credit' ? "Pagar agora" : "Confirmar pagamento"}
      </button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        Ao confirmar, você concorda com nossos Termos de Serviço e Política de Privacidade
      </p>
    </form>
  );
};

export default PaymentForm;
`;

// Template para a página inicial
const IndexPageTemplate = `// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProfessionalList from '../components/professionals/ProfessionalList';
import { getProfessionals, filterProfessionals } from '../services/professionals';
import { MapPin, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const HomePage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    zone: '',
    category: '',
  });

  // Zonas da cidade
  const zones = [
    { id: 'north', name: 'Zona Norte' },
    { id: 'south', name: 'Zona Sul' },
    { id: 'east', name: 'Zona Leste' },
    { id: 'west', name: 'Zona Oeste' },
    { id: 'center', name: 'Região Central' },
  ];

  // Categorias de serviços
  const categories = [
    { id: 'braids', name: 'Tranças' },
    { id: 'hair', name: 'Cabelo' },
    { id: 'barber', name: 'Barbearia' },
    { id: 'nails', name: 'Unhas' },
    { id: 'makeup', name: 'Maquiagem' },
  ];

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await filterProfessionals(
        searchTerm,
        activeFilters.zone,
        activeFilters.category
      );
      setProfessionals(results);
    } catch (error) {
      console.error('Erro ao filtrar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...activeFilters };
    
    // Se clicar no mesmo valor, limpa o filtro
    if (newFilters[type] === value) {
      newFilters[type] = '';
    } else {
      newFilters[type] = value;
    }
    
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({ zone: '', category: '' });
    setSearchTerm('');
    // Recarrega todos os profissionais
    getProfessionals().then(data => setProfessionals(data));
  };

  // Conta quantos filtros estão ativos
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <MainLayout>
      <div className="p-4">
        {/* Cabeçalho e busca */}
        <h1 className="text-2xl font-medium mb-6">Agenda Livre</h1>
        
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl"
            placeholder="Buscar profissional ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
        </div>
        
        {/* Área de filtros */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center">
              <Filter size={16} className="mr-2" />
              <span className="font-medium">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {showFilters && (
            <div className="bg-white rounded-xl p-4 mb-3">
              <h3 className="font-medium mb-3">Zonas</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    className={\`px-3 py-1.5 rounded-full text-sm \${
                      activeFilters.zone === zone.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }\`}
                    onClick={() => handleFilterChange('zone', zone.id)}
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
              
              <h3 className="font-medium mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={\`px-3 py-1.5 rounded-full text-sm \${
                      activeFilters.category === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }\`}
                    onClick={() => handleFilterChange('category', category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button
                  className="text-sm text-gray-500"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
                <button
                  className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg"
                  onClick={handleSearch}
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Lista de profissionais */}
        <h2 className="text-lg font-medium mb-4">Profissionais Disponíveis</h2>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          </div>
        ) : (
          <>
            <ProfessionalList professionals={professionals} />
            
            {professionals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum profissional encontrado com os filtros selecionados.</p>
                <button 
                  className="mt-2 text-purple-600 font-medium"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
`;

// Template para Página de Login
const LoginPageTemplate = `// src/pages/auth/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const success = await login(data);
      if (success) {
        router.push('/');
      } else {
        setError('Não foi possível fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      setError('Ocorreu um erro durante o login. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Agenda Livre</h1>
        <h2 className="mt-2 text-center text-2xl font-medium text-gray-900">Entrar na sua conta</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.email ? 'border-red-500' : ''
                  }\`}
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.password ? 'border-red-500' : ''
                  }\`}
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/password-reset" className="font-medium text-purple-600 hover:text-purple-500">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={\`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 \${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }\`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Entrar com Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Entrar com Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/auth/register" className="font-medium text-purple-600 hover:text-purple-500">
                Registre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
`;

// Template para Página de Registro
const RegisterPageTemplate = `// src/pages/auth/register.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'client' | 'professional';
}

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      userType: 'client'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    try {
      // Remover confirmPassword antes de enviar
      const { confirmPassword, ...userData } = data;
      
      const success = await registerUser(userData);
      if (success) {
        router.push('/');
      } else {
        setError('Não foi possível criar a conta. Tente novamente.');
      }
    } catch (error) {
      setError('Ocorreu um erro durante o registro. Tente novamente.');
      console.error('Erro no registro:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Agenda Livre</h1>
        <h2 className="mt-2 text-center text-2xl font-medium text-gray-900">Criar nova conta</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.name ? 'border-red-500' : ''
                  }\`}
                  {...register('name', {
                    required: 'Nome é obrigatório'
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.email ? 'border-red-500' : ''
                  }\`}
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.phone ? 'border-red-500' : ''
                  }\`}
                  placeholder="(11) 99999-9999"
                  {...register('phone', {
                    required: 'Telefone é obrigatório',
                    pattern: {
                      value: /^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$/,
                      message: 'Formato de telefone inválido'
                    }
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.password ? 'border-red-500' : ''
                  }\`}
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  className={\`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 \${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }\`}
                  {...register('confirmPassword', {
                    required: 'Por favor, confirme sua senha',
                    validate: value => value === password || 'As senhas não coincidem'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de conta
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="userType-client"
                    type="radio"
                    value="client"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    {...register('userType')}
                  />
                  <label htmlFor="userType-client" className="ml-3 block text-sm text-gray-700">
                    Cliente (busco profissionais)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="userType-professional"
                    type="radio"
                    value="professional"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    {...register('userType')}
                  />
                  <label htmlFor="userType-professional" className="ml-3 block text-sm text-gray-700">
                    Profissional (ofereço serviços)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={\`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 \${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }\`}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
`;