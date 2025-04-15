// src/utils/mockData.ts
import { Professional } from '@/types/professional';
import { Service } from '@/types/service';
import { Review } from '@/types/review';

// Serviços mockados
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Box Braids',
    description: 'Tranças box braids com ou sem cabelo sintético incluído.',
    price: 250,
    duration: 180,
    hasHairOption: true,
    hairPriceSmall: 60,
    hairPriceMedium: 80,
    hairPriceLarge: 120,
  },
  {
    id: '2',
    name: 'Twist Senegalês',
    description: 'Tranças estilo twist com acabamento profissional.',
    price: 290,
    duration: 240,
    hasHairOption: true,
    hairPriceSmall: 70,
    hairPriceMedium: 90,
    hairPriceLarge: 130,
  },
  {
    id: '3',
    name: 'Penteado para Festa',
    description: 'Penteados elegantes para ocasiões especiais.',
    price: 150,
    duration: 90,
  },
  {
    id: '4',
    name: 'Manutenção de Tranças',
    description: 'Manutenção e retoque em tranças existentes.',
    price: 100,
    duration: 60,
  },
  {
    id: '5',
    name: 'Corte Feminino',
    description: 'Corte, lavagem e finalização.',
    price: 80,
    duration: 60,
  },
  {
    id: '6',
    name: 'Coloração',
    description: 'Aplicação de coloração profissional completa.',
    price: 150,
    duration: 120,
  },
  {
    id: '7',
    name: 'Hidratação',
    description: 'Tratamento hidratante profundo para recuperação dos fios.',
    price: 90,
    duration: 60,
  },
];

// Avaliações mockadas
export const mockReviews: Review[] = [
  {
    id: '1',
    professionalId: '1',
    clientId: '101',
    clientName: 'Maria Silva',
    rating: 5,
    comment: 'Amei o resultado! As tranças ficaram perfeitas e ela é super atenciosa.',
    date: '15/03/2025',
    serviceId: '1',
    serviceName: 'Box Braids',
  },
  {
    id: '2',
    professionalId: '1',
    clientId: '102',
    clientName: 'Juliana Costa',
    rating: 4,
    comment: 'Muito bom o trabalho, bem profissional. Só achei um pouco demorado.',
    date: '28/02/2025',
    serviceId: '2',
    serviceName: 'Twist Senegalês',
  },
  {
    id: '3',
    professionalId: '2',
    clientId: '103',
    clientName: 'Fernanda Oliveira',
    rating: 5,
    comment: 'Adorei o corte! Ficou exatamente como eu queria.',
    date: '10/03/2025',
    serviceId: '5',
    serviceName: 'Corte Feminino',
  },
  {
    id: '4',
    professionalId: '3',
    clientId: '104',
    clientName: 'Camila Santos',
    rating: 3,
    comment: 'Serviço bom, mas esperava mais atenção aos detalhes.',
    date: '05/03/2025',
    serviceId: '6',
    serviceName: 'Coloração',
  },
  {
    id: '8',
    name: 'Tratamento Capilar Intensivo',
    description: 'Tratamento completo para recuperação de fios danificados.',
    price: 200,
    duration: 120,
  },
  {
    id: '9',
    name: 'Escova Progressive',
    description: 'Escova com produtos especiais para definição e brilho.',
    price: 120,
    duration: 90,
  },
];

// Profissionais mockados
export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Ana Oliveira',
    specialty: 'Especialista em Tranças e Penteados',
    profileImage: '/api/placeholder/300/300',
    coverImage: '/api/placeholder/800/300',
    bio: 'Trancista há mais de 10 anos, especializada em diversos estilos de tranças afro. Trabalho com técnicas que garantem conforto e durabilidade.',
    rating: 4.8,
    reviewCount: 127,
    location: 'Pinheiros',
    zone: 'Oeste',
    offersHomeService: true,
    homeServiceFee: 50,
    instagram: 'ana.oliveira.tranças',
    phone: '(11) 98765-4321',
    email: 'ana.oliveira@example.com',
    services: [mockServices[0], mockServices[1], mockServices[2], mockServices[3]],
    reviews: [mockReviews[0], mockReviews[1]],
    isVerified: true,
  },
  {
    id: '2',
    name: 'Bárbara Santos',
    specialty: 'Cabeleireira e Colorista',
    profileImage: '/api/placeholder/300/300',
    rating: 4.7,
    reviewCount: 98,
    location: 'Moema',
    zone: 'Sul',
    offersHomeService: false,
    homeServiceFee: 0,
    services: [mockServices[4], mockServices[5], mockServices[6]],
    reviews: [mockReviews[2]],
    isVerified: true,
  },
  {
    id: '3',
    name: 'Carla Mendes',
    specialty: 'Especialista em Química Capilar',
    profileImage: '/api/placeholder/300/300',
    rating: 4.5,
    reviewCount: 75,
    location: 'Santana',
    zone: 'Norte',
    offersHomeService: true,
    homeServiceFee: 40,
    instagram: 'carlamendes.hair',
    services: [mockServices[5], mockServices[6]],
    reviews: [mockReviews[3]],
    isVerified: false,
  },
  {
    id: '4',
    name: 'Denise Pereira',
    specialty: 'Trancista e Cabeleireira',
    profileImage: '/api/placeholder/300/300',
    rating: 4.9,
    reviewCount: 45,
    location: 'Tatuapé',
    zone: 'Leste',
    offersHomeService: true,
    homeServiceFee: 30,
    services: [mockServices[0], mockServices[1], mockServices[3], mockServices[4]],
    isVerified: true,
  },
  {
    id: '5',
    name: 'Eduardo Gomes',
    specialty: 'Barbeiro e Cabeleireiro',
    profileImage: '/api/placeholder/300/300',
    rating: 4.6,
    reviewCount: 87,
    location: 'Bela Vista',
    zone: 'Central',
    offersHomeService: false,
    homeServiceFee: 0,
    instagram: 'eduardogomes.barber',
    services: [mockServices[4], mockServices[5]],
    isVerified: true,
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    specialty: 'Especialista em Tratamentos Capilares',
    profileImage: '/api/placeholder/300/300',
    coverImage: '/api/placeholder/800/300',
    bio: 'Especializada em tratar problemas capilares como queda, ressecamento e danos químicos. Uso apenas produtos veganos e naturais.',
    rating: 4.7,
    reviewCount: 63,
    location: 'Vila Mariana',
    zone: 'Sul',
    offersHomeService: true,
    homeServiceFee: 45,
    phone: '(11) 97654-3210',
    email: 'fernanda.lima@example.com',
    services: [mockServices[6], mockServices[7], mockServices[8]],
    isVerified: true,
  },
  {
    id: '7',
    name: 'Gabriel Costa',
    specialty: 'Cabeleireiro e Especialista em Cachos',
    profileImage: '/api/placeholder/300/300',
    rating: 4.8,
    reviewCount: 42,
    location: 'Perdizes',
    zone: 'Oeste',
    offersHomeService: false,
    homeServiceFee: 0,
    instagram: 'gabriel.cachos',
    services: [mockServices[4], mockServices[6], mockServices[7]],
    isVerified: false,
  },
];

// Dados mockados para desenvolvimento da interface

// Lista de profissionais
export const professionals = [
  {
    id: 1,
    name: "Ana Oliveira",
    specialty: "Especialista em Tranças e Penteados",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.8,
    district: "Moema",
    zone: "Zona Sul",
    categories: ["Tranças", "Penteados"],
    instagram: "@ana.oliveira.beauty",
    offers_home_service: true,
    home_service_fee: 50,
    services: [
      { id: 1, name: "Volume Brasileiro", price: 180, duration: 90 },
      { id: 2, name: "Volume Russo", price: 220, duration: 120 },
      { id: 3, name: "Cílios Clássicos", price: 150, duration: 60 },
      { id: 4, name: "Manutenção", price: 100, duration: 45 }
    ],
    availableTimes: ["10:00", "12:30", "15:00", "17:30"],
    reviews: [
      { id: 1, user: "Bianca L.", rating: 5, comment: "Trabalho impecável e duradouro!", date: "2025-04-08" },
      { id: 2, user: "Daniela R.", rating: 5, comment: "Ótima profissional, super recomendo", date: "2025-04-01" }
    ]
  },
  {
    id: 7,
    name: "Marcelo Lima",
    specialty: "Cabeleireiro e Colorista",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.7,
    district: "Consolação",
    zone: "Região Central",
    categories: ["Corte"],
    instagram: "@marcelo.hair",
    offers_home_service: false,
    services: [
      { id: 1, name: "Corte Feminino", price: 90, duration: 60 },
      { id: 2, name: "Coloração", price: 180, duration: 120 },
      { id: 3, name: "Mechas/Luzes", price: 250, duration: 180 },
      { id: 4, name: "Hidratação", price: 120, duration: 60 }
    ],
    availableTimes: ["09:00", "11:00", "14:00", "16:00", "18:00"],
    reviews: [
      { id: 1, user: "Luciana F.", rating: 5, comment: "Melhor colorista da cidade!", date: "2025-04-12" },
      { id: 2, user: "Helena M.", rating: 4, comment: "Adorei o corte e a cor ficou perfeita", date: "2025-04-05" }
    ]
  },
  {
    id: 8,
    name: "Juliana Martins",
    specialty: "Depilação e Estética",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.6,
    district: "Ipiranga",
    zone: "Zona Sul",
    categories: ["Depilação"],
    instagram: "@ju.estetica",
    offers_home_service: true,
    home_service_fee: 40,
    services: [
      { id: 1, name: "Depilação Completa", price: 160, duration: 120 },
      { id: 2, name: "Depilação Meia Perna", price: 60, duration: 30 },
      { id: 3, name: "Depilação Axila", price: 40, duration: 20 },
      { id: 4, name: "Depilação Virilha", price: 80, duration: 45 }
    ],
    availableTimes: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    reviews: [
      { id: 1, user: "Rafaela S.", rating: 4, comment: "Atendimento rápido e eficiente", date: "2025-04-10" },
      { id: 2, user: "Natália C.", rating: 5, comment: "Muito profissional e atenciosa", date: "2025-04-02" }
    ]
  }
];

// Categorias populares
export const popularCategories = [
  { id: 1, name: "Tranças", count: 28 },
  { id: 2, name: "Penteados", count: 24 },
  { id: 3, name: "Make", count: 17 },
  { id: 4, name: "Barba", count: 12 },
  { id: 5, name: "Manicure", count: 19 },
  { id: 6, name: "Massagem", count: 8 },
  { id: 7, name: "Depilação", count: 6 },
  { id: 8, name: "Corte", count: 22 }
];

// Zonas da cidade
export const zones = [
  { id: 1, name: "Zona Norte", count: 15 },
  { id: 2, name: "Zona Sul", count: 32 },
  { id: 3, name: "Zona Leste", count: 18 },
  { id: 4, name: "Zona Oeste", count: 24 },
  { id: 5, name: "Região Central", count: 12 }
];

// Distritos/bairros
export const districts = [
  { id: 1, name: "Moema", count: 12, zone: "Zona Sul" },
  { id: 2, name: "Vila Mariana", count: 8, zone: "Zona Sul" },
  { id: 3, name: "Pinheiros", count: 14, zone: "Zona Oeste" },
  { id: 4, name: "Itaim Bibi", count: 10, zone: "Zona Oeste" },
  { id: 5, name: "Santana", count: 6, zone: "Zona Norte" },
  { id: 6, name: "Tatuapé", count: 9, zone: "Zona Leste" },
  { id: 7, name: "Jardins", count: 11, zone: "Zona Oeste" },
  { id: 8, name: "Bela Vista", count: 7, zone: "Região Central" },
  { id: 9, name: "Vila Olímpia", count: 5, zone: "Zona Sul" },
  { id: 10, name: "Consolação", count: 8, zone: "Região Central" },
  { id: 11, name: "Ipiranga", count: 4, zone: "Zona Sul" },
  { id: 12, name: "Perdizes", count: 6, zone: "Zona Oeste" }
]; "Box Braids", price: 250, duration: 180 },
      { id: 2, name: "Twist Senegalês", price: 290, duration: 240 },
      { id: 3, name: "Penteado para Festa", price: 150, duration: 90 },
      { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60 }
    ],
    availableTimes: ["09:00", "11:30", "14:00", "16:30"],
    reviews: [
      { id: 1, user: "Camila S.", rating: 5, comment: "Trabalho incrível, super recomendo!", date: "2025-03-15" },
      { id: 2, user: "Renata L.", rating: 4, comment: "Adorei o resultado das box braids!", date: "2025-03-10" },
      { id: 3, user: "Juliana M.", rating: 5, comment: "Valeu cada centavo, tranças perfeitas.", date: "2025-03-01" }
    ]
  },
  {
    id: 2,
    name: "Carlos Santos",
    specialty: "Barbeiro e Cabeleireiro",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.7,
    district: "Pinheiros",
    zone: "Zona Oeste",
    categories: ["Barba", "Corte"],
    instagram: "@carlos.barber",
    offers_home_service: false,
    services: [
      { id: 1, name: "Corte Degradê", price: 70, duration: 45 },
      { id: 2, name: "Barba Completa", price: 50, duration: 30 },
      { id: 3, name: "Corte + Barba", price: 100, duration: 75 },
      { id: 4, name: "Tingimento", price: 120, duration: 90 }
    ],
    availableTimes: ["10:00", "12:00", "15:00", "17:30", "19:00"],
    reviews: [
      { id: 1, user: "André R.", rating: 5, comment: "Melhor barbeiro da região", date: "2025-04-01" },
      { id: 2, user: "Pedro H.", rating: 4, comment: "Atendimento excelente", date: "2025-03-20" }
    ]
  },
  {
    id: 3,
    name: "Thaís Moreira",
    specialty: "Maquiadora Profissional",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.9,
    district: "Vila Mariana",
    zone: "Zona Sul",
    categories: ["Make"],
    instagram: "@thais.makeup",
    offers_home_service: true,
    home_service_fee: 40,
    services: [
      { id: 1, name: "Maquiagem Social", price: 150, duration: 60 },
      { id: 2, name: "Maquiagem para Noivas", price: 350, duration: 120 },
      { id: 3, name: "Design de Sobrancelhas", price: 80, duration: 40 },
      { id: 4, name: "Curso de Automaquiagem", price: 200, duration: 120 }
    ],
    availableTimes: ["08:00", "10:30", "13:00", "16:00", "18:30"],
    reviews: [
      { id: 1, user: "Mariana F.", rating: 5, comment: "Incrível! Fez minha maquiagem para casamento e ficou perfeita.", date: "2025-04-05" },
      { id: 2, user: "Claudia P.", rating: 5, comment: "Super talentosa e profissional", date: "2025-03-28" }
    ]
  },
  {
    id: 4,
    name: "Patricia Sousa",
    specialty: "Manicure e Pedicure",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.6,
    district: "Santana",
    zone: "Zona Norte",
    categories: ["Manicure"],
    instagram: "@pati.nails",
    offers_home_service: true,
    home_service_fee: 30,
    services: [
      { id: 1, name: "Manicure Simples", price: 40, duration: 40 },
      { id: 2, name: "Pedicure", price: 50, duration: 50 },
      { id: 3, name: "Unhas de Gel", price: 120, duration: 90 },
      { id: 4, name: "Spa de Mãos e Pés", price: 150, duration: 120 }
    ],
    availableTimes: ["09:00", "11:00", "14:00", "16:00", "18:00"],
    reviews: [
      { id: 1, user: "Fernanda M.", rating: 4, comment: "Ótimo atendimento e preço justo", date: "2025-04-02" },
      { id: 2, user: "Amanda L.", rating: 5, comment: "Minhas unhas nunca ficaram tão bonitas", date: "2025-03-25" }
    ]
  },
  {
    id: 5,
    name: "Rafael Costa",
    specialty: "Massagista Terapêutico",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.8,
    district: "Tatuapé",
    zone: "Zona Leste",
    categories: ["Massagem"],
    instagram: "@rafael.massoterapia",
    offers_home_service: true,
    home_service_fee: 60,
    services: [
      { id: 1, name: "Massagem Relaxante", price: 120, duration: 60 },
      { id: 2, name: "Massagem Terapêutica", price: 150, duration: 60 },
      { id: 3, name: "Drenagem Linfática", price: 180, duration: 90 },
      { id: 4, name: "Ventosaterapia", price: 100, duration: 45 }
    ],
    availableTimes: ["08:00", "10:00", "13:00", "15:00", "17:00", "19:00"],
    reviews: [
      { id: 1, user: "Marcelo S.", rating: 5, comment: "Excelente profissional, saí renovado", date: "2025-04-10" },
      { id: 2, user: "Cristina A.", rating: 5, comment: "Melhor massagem que já fiz", date: "2025-04-05" }
    ]
  },
  {
    id: 6,
    name: "Camila Rodrigues",
    specialty: "Extensão de Cílios",
    profileImage: "/api/placeholder/300/300",
    coverImage: "/api/placeholder/800/500",
    rating: 4.9,
    district: "Itaim Bibi",
    zone: "Zona Oeste",
    categories: ["Make"],
    instagram: "@camila.lashes",
    offers_home_service: false,
    services: [
      { id: 1, name:}