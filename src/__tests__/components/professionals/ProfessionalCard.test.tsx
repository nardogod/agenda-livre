// src/__tests__/components/professionals/ProfessionalCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProfessionalCard, Professional } from '../../../components/professionals/ProfessionalCard';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock do componente Link do Next.js
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock do componente Image do Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('ProfessionalCard Component', () => {
  const mockProfessional: Professional = {
    id: '123',
    name: 'Ana Oliveira',
    specialty: 'Especialista em Tranças',
    profileImage: '/api/placeholder/300/300',
    location: {
      district: 'Pinheiros',
      zone: 'Zona Oeste'
    },
    rating: 4.8,
    reviewCount: 42,
    services: {
      minPrice: 150
    }
  };

  it('renderiza informações do profissional corretamente', () => {
    render(<ProfessionalCard professional={mockProfessional} />);

    expect(screen.getByText('Ana Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Especialista em Tranças')).toBeInTheDocument();
    expect(screen.getByText('Pinheiros')).toBeInTheDocument();
    expect(screen.getByText('Zona Oeste')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
    expect(screen.getByText('R$ 150.00')).toBeInTheDocument();
  });

  it('lida com profissional sem avaliações', () => {
    const professionalSemAvaliacao = {
      ...mockProfessional,
      rating: undefined,
      reviewCount: undefined
    };
    
    render(<ProfessionalCard professional={professionalSemAvaliacao} />);

    expect(screen.getByText('Ana Oliveira')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('(0)')).toBeInTheDocument();
  });

  it('lida com profissional sem preço mínimo', () => {
    const professionalSemPreco = {
      ...mockProfessional,
      services: undefined
    };
    
    render(<ProfessionalCard professional={professionalSemPreco} />);

    expect(screen.getByText('Ana Oliveira')).toBeInTheDocument();
    expect(screen.queryByText('A partir de')).not.toBeInTheDocument();
  });
});