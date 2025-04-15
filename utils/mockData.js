import { addDays, format, parse, startOfDay, addMinutes, addHours } from 'date-fns';

// Gera dados de agendamentos mockados
export const generateMockAppointments = (count = 10, startDate = new Date()) => {
  const appointments = [];
  
  // Lista de serviços de exemplo
  const sampleServices = [
    { id: 1, name: "Box Braids", price: 250, duration: 180 },
    { id: 2, name: "Twist Senegalês", price: 290, duration: 240 },
    { id: 3, name: "Penteado para Festa", price: 150, duration: 90 },
    { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60 }
  ];
  
  // Lista de status possíveis
  const statuses = ['pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show'];
  
  // Gerar os agendamentos
  for (let i = 0; i < count; i++) {
    const service = sampleServices[Math.floor(Math.random() * sampleServices.length)];
    const dayOffset = Math.floor(Math.random() * 14) - 7; // Entre -7 e 7 dias a partir de hoje
    const appointmentDate = addDays(startDate, dayOffset);
    
    // Horário aleatório entre 9h e 17h
    const hour = 9 + Math.floor(Math.random() * 8);
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    
    const startDateTime = new Date(appointmentDate.setHours(hour, minute, 0, 0));
    const endDateTime = addMinutes(startDateTime, service.duration);
    
    // Status baseado em data (passado = completed ou cancelled, futuro = confirmed ou pending_payment)
    let status;
    if (startDateTime < new Date()) {
      status = Math.random() > 0.2 ? 'completed' : Math.random() > 0.5 ? 'cancelled' : 'no_show';
    } else {
      status = Math.random() > 0.3 ? 'confirmed' : 'pending_payment';
    }
    
    // Opções aleatórias
    const useOwnHair = Math.random() > 0.5;
    const hairLength = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
    const isHomeService = Math.random() > 0.7;
    const hasAllergies = Math.random() > 0.8;
    
    // Calcular preço total
    let totalPrice = service.price;
    
    // Adicionar opções de cabelo se não estiver usando o próprio
    if (!useOwnHair) {
      const hairPrices = {
        small: 60,
        medium: 80,
        large: 120
      };
      totalPrice += hairPrices[hairLength];
    }
    
    // Adicionar taxa de serviço a domicílio
    if (isHomeService) {
      totalPrice += 50;
    }
    
    // Cliente fictício
    const client = {
      id: 100 + i,
      first_name: ['Ana', 'Carla', 'Beatriz', 'Mariana', 'Juliana'][Math.floor(Math.random() * 5)],
      last_name: ['Silva', 'Oliveira', 'Santos', 'Souza', 'Ferreira'][Math.floor(Math.random() * 5)],
      email: `cliente${i}@example.com`,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`
    };
    
    // Profissional fictício
    const professional = {
      id: 1,
      user: {
        id: 1,
        first_name: 'Ana',
        last_name: 'Oliveira',
        email: 'ana.oliveira@example.com'
      },
      profile_image: '/api/placeholder/300/300',
      instagram: '@ana.trancinhas',
      location: 'Moema, São Paulo'
    };
    
    const appointment = {
      id: i + 1,
      professional,
      client,
      service: {
        ...service,
        has_hair_option: !useOwnHair,
        hair_price_small: 60,
        hair_price_medium: 80,
        hair_price_large: 120
      },
      start_datetime: startDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      use_own_hair: useOwnHair,
      hair_length: hairLength,
      is_home_service: isHomeService,
      has_allergies: hasAllergies,
      allergies_description: hasAllergies ? 'Alergia a alguns óleos essenciais' : '',
      notes: Math.random() > 0.7 ? 'Prefiro que o serviço seja feito com cuidado extra.' : '',
      status,
      service_price: service.price,
      hair_price: !useOwnHair ? (hairLength === 'small' ? 60 : hairLength === 'medium' ? 80 : 120) : 0,
      home_service_fee: isHomeService ? 50 : 0,
      total_price: totalPrice,
      has_review: status === 'completed' && Math.random() > 0.5,
      created_at: addHours(startDateTime, -24).toISOString(),
      updated_at: startDateTime.toISOString()
    };
    
    appointments.push(appointment);
  }
  
  return appointments;
};

// Gera dados de serviços mockados para um profissional
export const generateMockServices = (count = 5) => {
  const services = [
    {
      id: 1,
      name: "Box Braids",
      description: "Tranças Box Braids em diversos tamanhos e comprimentos. Acabamento perfeito e durabilidade garantida.",
      price: 250,
      duration: 180,
      has_hair_option: true,
      hair_price_small: 60,
      hair_price_medium: 80,
      hair_price_large: 120,
      active: true,
      image: "/api/placeholder/300/300"
    },
    {
      id: 2,
      name: "Twist Senegalês",
      description: "Tranças estilo Twist Senegalês, perfeitas para um visual elegante e duradouro.",
      price: 290,
      duration: 240,
      has_hair_option: true,
      hair_price_small: 70,
      hair_price_medium: 90,
      hair_price_large: 130,
      active: true,
      image: "/api/placeholder/300/300"
    },
    {
      id: 3,
      name: "Penteado para Festa",
      description: "Penteados elegantes para festas, casamentos e eventos especiais.",
      price: 150,
      duration: 90,
      has_hair_option: false,
      hair_price_small: 0,
      hair_price_medium: 0,
      hair_price_large: 0,
      active: true,
      image: "/api/placeholder/300/300"
    },
    {
      id: 4,
      name: "Manutenção de Tranças",
      description: "Reparo e manutenção de tranças existentes, aumentando sua durabilidade.",
      price: 100,
      duration: 60,
      has_hair_option: false,
      hair_price_small: 0,
      hair_price_medium: 0,
      hair_price_large: 0,
      active: true,
      image: null
    },
    {
      id: 5,
      name: "Tranças de Raiz",
      description: "Tranças feitas na raiz do cabelo, ideais para quem busca um visual natural e moderno.",
      price: 180,
      duration: 120,
      has_hair_option: false,
      hair_price_small: 0,
      hair_price_medium: 0,
      hair_price_large: 0,
      active: true,
      image: null
    }
  ];
  
  return services.slice(0, count);
};

// Dados de notificações mockados
export const mockNotifications = [
  {
    id: '1',
    userId: 'user-123',
    title: 'Novo agendamento',
    message: 'Maria Silva agendou Box Braids para 14/04/2025',
    type: 'appointment',
    status: 'unread',
    createdAt: '2025-04-13T14:30:00',
    data: { appointmentId: '1' }
  },
  {
    id: '2',
    userId: 'user-123',
    title: 'Pagamento confirmado',
    message: 'Pagamento de R$ 290,00 confirmado para o agendamento de João Santos',
    type: 'payment',
    status: 'unread',
    createdAt: '2025-04-13T12:15:00',
    data: { appointmentId: '2', amount: 290.0 }
  },
  {
    id: '3',
    userId: 'user-123',
    title: 'Nova avaliação',
    message: 'Paula Oliveira deixou uma avaliação 5 estrelas para você',
    type: 'review',
    status: 'read',
    createdAt: '2025-04-12T18:45:00',
    data: { reviewId: '1', rating: 5 }
  },
  {
    id: '4',
    userId: 'user-123',
    title: 'Lembrete de agendamento',
    message: 'Você tem um agendamento amanhã às 14:30 com Maria Silva',
    type: 'appointment',
    status: 'read',
    createdAt: '2025-04-12T10:00:00',
    data: { appointmentId: '1' }
  },
  {
    id: '5',
    userId: 'user-123',
    title: 'Dica da semana',
    message: 'Otimize seu tempo oferecendo pacotes de serviços combinados',
    type: 'system',
    status: 'unread',
    createdAt: '2025-04-11T09:30:00',
    data: { articleId: '123' }
  }
];

// Dados de integrações de calendário mockados
export const mockCalendarIntegrations = [
  {
    id: '1',
    provider: 'google',
    isConnected: true,
    lastSyncedAt: '2025-04-13T10:30:00'
  },
  {
    id: '2',
    provider: 'outlook',
    isConnected: false,
    lastSyncedAt: null
  }
];

// Dados de analytics mockados
export const mockAnalyticsData = {
  totalAppointments: {
    week: 12,
    month: 48,
    quarter: 142,
    year: 567
  },
  revenue: {
    week: 'R$ 2.950,00',
    month: 'R$ 12.480,00',
    quarter: 'R$ 36.750,00',
    year: 'R$ 142.300,00'
  },
  newClients: {
    week: 3,
    month: 14,
    quarter: 42,
    year: 168
  },
  trends: {
    week: {
      appointments: 5,
      revenue: 8,
      clients: 12
    },
    month: {
      appointments: 12,
      revenue: 15,
      clients: 7
    },
    quarter: {
      appointments: 8,
      revenue: 11,
      clients: 3
    },
    year: {
      appointments: 22,
      revenue: 18,
      clients: 15
    }
  }
};

// Dados de avaliações mockados
export const mockReviews = [
  {
    id: '1',
    clientId: 'client-1',
    clientName: 'Maria Silva',
    rating: 5,
    comment: 'Trabalho incrível! Ana tem um talento especial para Box Braids. O acabamento ficou perfeito e as tranças estão durando muito mais do que eu esperava. Além de ser muito simpática e pontual. Recomendo!',
    date: '2025-04-10T15:30:00',
    serviceId: '1',
    serviceName: 'Box Braids'
  },
  {
    id: '2',
    clientId: 'client-2',
    clientName: 'Carla Souza',
    rating: 4,
    comment: 'Gostei bastante do resultado. As tranças ficaram ótimas, apenas o tempo de execução foi um pouco além do esperado. Mas o resultado final valeu a pena.',
    date: '2025-04-05T17:45:00',
    serviceId: '2',
    serviceName: 'Twist Senegalês'
  },
  {
    id: '3',
    clientId: 'client-3',
    clientName: 'Paula Santos',
    rating: 5,
    comment: 'Meu penteado para festa ficou exatamente como eu queria! Ana entendeu perfeitamente o que eu pedi e ainda deu dicas valiosas. Já marquei outro serviço.',
    date: '2025-04-01T10:20:00',
    serviceId: '3',
    serviceName: 'Penteado para Festa'
  },
  {
    id: '4',
    clientId: 'client-4',
    clientName: 'Juliana Oliveira',
    rating: 5,
    comment: 'Sensacional! Ana é muito cuidadosa e habilidosa. Fez minhas box braids exatamente como eu queria, respeitando o tamanho e espessura que pedi. Ambiente limpo e aconchegante.',
    date: '2025-03-25T14:10:00',
    serviceId: '1',
    serviceName: 'Box Braids'
  },
  {
    id: '5',
    clientId: 'client-5',
    clientName: 'Beatriz Lima',
    rating: 3,
    comment: 'O serviço ficou bom, mas poderia ser melhor. Algumas tranças estão um pouco mais folgadas que outras. Porém, a profissional foi muito simpática e o ambiente é agradável.',
    date: '2025-03-20T11:30:00',
    serviceId: '2',
    serviceName: 'Twist Senegalês'
  }
];

// Intercepta e simula chamadas à API para desenvolvimento
export const mockApiResponse = (endpoint, params) => {
  // Simula um pequeno delay para imitar o tempo de resposta da API
  return new Promise((resolve) => {
    setTimeout(() => {
      let data;
      
      // Mock para diferentes endpoints
      if (endpoint.includes('/appointments/')) {
        const appointmentId = parseInt(endpoint.split('/').pop());
        const appointments = generateMockAppointments(20);
        data = appointments.find(a => a.id === appointmentId) || null;
      } 
      else if (endpoint.includes('/appointments')) {
        const appointments = generateMockAppointments(20);
        
        // Filtrar por status se especificado
        if (params && params.status) {
          const statusList = params.status.split(',');
          data = appointments.filter(a => statusList.includes(a.status));
        } else {
          data = appointments;
        }
        
        // Ordenação
        if (params && params.sort) {
          const sortField = params.sort;
          data.sort((a, b) => {
            if (sortField === 'start_datetime') {
              return new Date(a.start_datetime) - new Date(b.start_datetime);
            }
            return 0;
          });
        }
        
        // Limitar resultados
        if (params && params.limit) {
          data = data.slice(0, parseInt(params.limit));
        }
      }
      else if (endpoint.includes('/services')) {
        data = generateMockServices();
      }
      else if (endpoint.includes('/notifications')) {
        data = mockNotifications;
      }
      else if (endpoint.includes('/calendar/integrations')) {
        data = mockCalendarIntegrations;
      }
      else if (endpoint.includes('/professionals/reviews')) {
        data = mockReviews;
      }
      else if (endpoint.includes('/analytics')) {
        data = mockAnalyticsData;
      }
      else {
        data = { message: 'Endpoint not mocked' };
      }
      
      resolve({ data });
    }, 800); // Atraso de 800ms para simular tempo de resposta
  });
};

export const MOCK_PROFESSIONALS = [
  {
    id: '1',
    name: 'Ana Oliveira',
    email: 'ana@example.com',
    phone: '11999999999',
    userType: 'professional',
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/600/300',
    bio: 'Especialista em tranças e penteados com mais de 8 anos de experiência. Atendimento personalizado e resultados que valorizam sua beleza natural.',
    instagram: '@anaoliveira.beauty',
    location: 'Pinheiros, São Paulo - SP',
    district: 'Pinheiros',
    zone: 'Zona Oeste',
    offers_home_service: true,
    home_service_fee: 50,
    rating: 4.8,
    reviewCount: 25,
    isVerified: true,
    specialties: ['Tranças', 'Box Braids', 'Penteados'],
    services: [
      {
        id: '101',
        name: 'Box Braids',
        description: 'Tranças box braids com diversas opções de espessura e comprimento.',
        price: 250,
        duration: 180,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: true,
        hair_price_small: 60,
        hair_price_medium: 80,
        hair_price_large: 120,
        category: 'Tranças'
      },
      {
        id: '102',
        name: 'Twist Senegalês',
        description: 'Twist senegalês com cabelo sintético ou natural, acabamento perfeito.',
        price: 290,
        duration: 240,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: true,
        hair_price_small: 70,
        hair_price_medium: 90,
        hair_price_large: 130,
        category: 'Tranças'
      },
      {
        id: '103',
        name: 'Penteado para Festa',
        description: 'Penteado elegante para eventos e festas.',
        price: 150,
        duration: 90,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Penteados'
      }
    ],
    reviews: [
      {
        id: '201',
        clientId: '301',
        clientName: 'Mariana Silva',
        clientImage: '/api/placeholder/100/100',
        rating: 5,
        comment: 'Trabalho incrível! Ana é super profissional e cuidadosa. Amei o resultado das minhas box braids!',
        date: '2025-03-15T14:30:00'
      },
      {
        id: '202',
        clientId: '302',
        clientName: 'Carolina Santos',
        clientImage: '/api/placeholder/100/100',
        rating: 4,
        comment: 'Ótimo atendimento, pontual e atenciosa. O único ponto foi que demorou um pouco mais do que o previsto, mas valeu a pena!',
        date: '2025-02-28T10:15:00'
      },
      {
        id: '203',
        clientId: '303',
        clientName: 'Juliana Costa',
        clientImage: '/api/placeholder/100/100',
        rating: 5,
        comment: 'Perfeito! Já é a terceira vez que faço tranças com a Ana e sempre saio satisfeita. Super recomendo!',
        date: '2025-02-10T16:45:00'
      }
    ]
  },
  {
    id: '2',
    name: 'Carla Santos',
    email: 'carla@example.com',
    phone: '11988888888',
    userType: 'professional',
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/600/300',
    bio: 'Cabeleireira especializada em cortes e coloração. Transforme seu visual com quem entende do assunto.',
    instagram: '@carlasantos.hair',
    location: 'Vila Mariana, São Paulo - SP',
    district: 'Vila Mariana',
    zone: 'Zona Sul',
    offers_home_service: false,
    rating: 4.6,
    reviewCount: 18,
    isVerified: true,
    specialties: ['Cortes', 'Coloração', 'Tratamentos'],
    services: [
      {
        id: '201',
        name: 'Corte Feminino',
        description: 'Corte personalizado de acordo com seu formato de rosto e estilo.',
        price: 120,
        duration: 60,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Cortes'
      },
      {
        id: '202',
        name: 'Coloração Completa',
        description: 'Coloração completa com produtos de qualidade profissional.',
        price: 180,
        duration: 120,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Coloração'
      },
      {
        id: '203',
        name: 'Hidratação Profunda',
        description: 'Tratamento de hidratação intensiva para recuperar cabelos danificados.',
        price: 90,
        duration: 45,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Tratamentos'
      }
    ],
    reviews: [
      {
        id: '301',
        clientId: '401',
        clientName: 'Fernanda Lima',
        clientImage: '/api/placeholder/100/100',
        rating: 5,
        comment: 'Adorei o corte! Carla entendeu exatamente o que eu queria e deu dicas valiosas para o meu tipo de cabelo.',
        date: '2025-03-20T11:30:00'
      },
      {
        id: '302',
        clientId: '402',
        clientName: 'Patricia Mendes',
        clientImage: '/api/placeholder/100/100',
        rating: 4,
        comment: 'Coloração ficou ótima, mas achei o valor um pouco alto. De qualquer forma, o resultado valeu a pena!',
        date: '2025-03-05T14:00:00'
      }
    ]
  },
  {
    id: '3',
    name: 'Tiago Almeida',
    email: 'tiago@example.com',
    phone: '11977777777',
    userType: 'professional',
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/600/300',
    bio: 'Especialista em cortes masculinos e barbearia. Atendimento exclusivo com horário marcado.',
    instagram: '@tiago.barber',
    location: 'Moema, São Paulo - SP',
    district: 'Moema',
    zone: 'Zona Sul',
    offers_home_service: true,
    home_service_fee: 40,
    rating: 4.9,
    reviewCount: 32,
    isVerified: true,
    specialties: ['Barba', 'Corte Masculino', 'Degradê'],
    services: [
      {
        id: '301',
        name: 'Corte Masculino',
        description: 'Corte masculino personalizado com acabamento perfeito.',
        price: 80,
        duration: 45,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Cortes'
      },
      {
        id: '302',
        name: 'Barba Completa',
        description: 'Modelagem e acabamento perfeito da barba com toalha quente e produtos especiais.',
        price: 60,
        duration: 30,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Barba'
      },
      {
        id: '303',
        name: 'Combo Corte + Barba',
        description: 'Pacote completo com corte masculino e barba.',
        price: 130,
        duration: 75,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Combos'
      }
    ]
  },
  {
    id: '4',
    name: 'Juliana Ferreira',
    email: 'juliana@example.com',
    phone: '11966666666',
    userType: 'professional',
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/600/300',
    bio: 'Manicure e pedicure com mais de 10 anos de experiência. Especialista em nail art e unhas em gel.',
    instagram: '@juliana.nails',
    location: 'Santana, São Paulo - SP',
    district: 'Santana',
    zone: 'Zona Norte',
    offers_home_service: true,
    home_service_fee: 30,
    rating: 4.7,
    reviewCount: 45,
    isVerified: true,
    specialties: ['Unhas em Gel', 'Manicure', 'Nail Art'],
    services: [
      {
        id: '401',
        name: 'Manicure Simples',
        description: 'Corte, lixamento e esmaltação tradicional.',
        price: 50,
        duration: 45,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Manicure'
      },
      {
        id: '402',
        name: 'Pedicure Completa',
        description: 'Tratamento completo dos pés com esfoliação e hidratação.',
        price: 70,
        duration: 60,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Pedicure'
      },
      {
        id: '403',
        name: 'Unhas em Gel',
        description: 'Aplicação de unhas em gel com alongamento.',
        price: 150,
        duration: 90,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Unhas em Gel'
      }
    ]
  },
  {
    id: '5',
    name: 'Mariana Costa',
    email: 'mariana@example.com',
    phone: '11955555555',
    userType: 'professional',
    profileImage: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/600/300',
    bio: 'Especialista em maquiagem para todos os tipos de eventos. Realço sua beleza natural com técnicas modernas.',
    instagram: '@mariana.makeup',
    location: 'Tatuapé, São Paulo - SP',
    district: 'Tatuapé',
    zone: 'Zona Leste',
    offers_home_service: true,
    home_service_fee: 45,
    rating: 4.8,
    reviewCount: 28,
    isVerified: true,
    specialties: ['Maquiagem para Noivas', 'Maquiagem para Festas', 'Cursos'],
    services: [
      {
        id: '501',
        name: 'Maquiagem Social',
        description: 'Maquiagem para eventos sociais como festas e formaturas.',
        price: 180,
        duration: 60,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Maquiagem'
      },
      {
        id: '502',
        name: 'Maquiagem para Noivas',
        description: 'Maquiagem completa para noivas, inclui teste prévio.',
        price: 350,
        duration: 90,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Maquiagem'
      },
      {
        id: '503',
        name: 'Curso de Automaquiagem',
        description: 'Aprenda a se maquiar com técnicas profissionais adaptadas ao seu tipo de rosto.',
        price: 250,
        duration: 120,
        image: '/api/placeholder/300/200',
        active: true,
        has_hair_option: false,
        category: 'Cursos'
      }
    ]
  }
];

// Categories for filters
export const CATEGORIES = [
  'Tranças',
  'Penteados',
  'Cortes',
  'Coloração',
  'Barba',
  'Manicure',
  'Pedicure',
  'Unhas em Gel',
  'Maquiagem',
  'Tratamentos',
  'Outros'
];

// Zonas for filters
export const ZONES = [
  'Zona Norte',
  'Zona Sul',
  'Zona Leste',
  'Zona Oeste',
  'Centro'
];

// Districts for filters
export const DISTRICTS = [
  'Pinheiros',
  'Vila Mariana',
  'Moema',
  'Santana',
  'Tatuapé',
  'Itaim Bibi',
  'Jardins',
  'Consolação',
  'Perdizes',
  'Lapa',
  'Ipiranga',
  'Butantã',
  'Liberdade',
  'Vila Madalena',
  'Campo Belo'
];

// Price ranges for filters
export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Até R$ 50' },
  { min: 50, max: 100, label: 'R$ 50 - R$ 100' },
  { min: 100, max: 200, label: 'R$ 100 - R$ 200' },
  { min: 200, max: 300, label: 'R$ 200 - R$ 300' },
  { min: 300, max: null, label: 'Acima de R$ 300' }
];