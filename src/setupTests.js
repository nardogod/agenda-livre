// src/setupTests.js
import '@testing-library/jest-dom';

// Mock ResizeObserver que não está disponível no ambiente de teste
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observations = [];
  }

  observe(element) {
    this.observations.push(element);
  }

  unobserve(element) {
    this.observations = this.observations.filter(el => el !== element);
  }

  disconnect() {
    this.observations = [];
  }
}

// Configuração global para testes
global.ResizeObserver = ResizeObserverMock;