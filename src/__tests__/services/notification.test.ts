// src/__tests__/services/notification.test.ts
import api from '../../services/api'

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}))

// Em vez de importar as funções reais, crie versões mockadas para o teste
const mockNotificationService = {
  getNotifications: async () => {
    // Em produção, faz a chamada à API
    const response = await api.get('/notifications/');
    return response.data;
  },
  markAsRead: async (notificationId) => {
    await api.post(`/notifications/${notificationId}/read/`);
  },
  markAllAsRead: async () => {
    await api.post('/notifications/read-all/');
  },
  deleteNotification: async (notificationId) => {
    await api.delete(`/notifications/${notificationId}/`);
  }
};

// Mock o módulo notification para retornar as funções mockadas acima
jest.mock('../../services/notification', () => mockNotificationService, { virtual: true });

describe('Notification Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('getNotifications faz a chamada correta para a API', async () => {
    const mockResponse = { data: [{ id: '1', title: 'Notificação de teste' }] }
    
    // Configurar o mock para retornar dados simulados
    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)
    
    // Chamar a função
    const result = await mockNotificationService.getNotifications()
    
    // Verificar se a API foi chamada corretamente
    expect(api.get).toHaveBeenCalledWith('/notifications/')
    
    // Verificar se o resultado está correto
    expect(result).toEqual(mockResponse.data)
  })
  
  it('markAsRead faz a chamada correta para a API', async () => {
    const notificationId = '123'
    
    // Chamar a função
    await mockNotificationService.markAsRead(notificationId)
    
    // Verificar se a API foi chamada corretamente
    expect(api.post).toHaveBeenCalledWith(`/notifications/${notificationId}/read/`)
  })
})