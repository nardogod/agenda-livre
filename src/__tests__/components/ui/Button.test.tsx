// src/__tests__/components/ui/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../components/ui/buttons/Button';

describe('Button Component', () => {
  it('renderiza o botão com o texto correto', () => {
    render(<Button>Texto do Botão</Button>);
    expect(screen.getByText('Texto do Botão')).toBeInTheDocument();
  });

  it('aplica a variante primária por padrão', () => {
    render(<Button>Botão Primário</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-purple-600');
  });

  it('aplica a variante secondary corretamente', () => {
    render(<Button variant="secondary">Botão Secundário</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-purple-200');
    expect(button).toHaveClass('text-purple-600');
  });

  it('aplica a variante outline corretamente', () => {
    render(<Button variant="outline">Botão Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-gray-200');
    expect(button).toHaveClass('text-gray-700');
  });

  it('aplica a variante text corretamente', () => {
    render(<Button variant="text">Botão Texto</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-purple-600');
    expect(button).not.toHaveClass('bg-purple-600');
  });

  it('desabilita o botão quando disabled=true', () => {
    render(<Button disabled>Botão Desabilitado</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('chama a função onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    fireEvent.click(screen.getByText('Clique Aqui'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Botão Desabilitado</Button>);
    fireEvent.click(screen.getByText('Botão Desabilitado'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('aplica o tamanho correto quando size="sm"', () => {
    render(<Button size="sm">Botão Pequeno</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('text-xs');
  });

  it('aplica o tamanho correto quando size="lg"', () => {
    render(<Button size="lg">Botão Grande</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('py-4');
    expect(button).toHaveClass('text-base');
  });

  it('adiciona classes customizadas quando passado className', () => {
    render(<Button className="custom-class">Botão Customizado</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});