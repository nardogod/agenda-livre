// src/__tests__/services/calendar.test.ts
import api from '../../services/api';
import { 
  disconnectCalendar, 
  syncCalendarEvents,
  connectCalendar,
  getCalendarIntegrations
} from '../../services/calendar';

// Mock do axios/api
jest.mock('../../services/api', () => ({
  delete: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn()
}));

describe('Serviço de Calendário', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disconnectCalendar faz a chamada correta para a API', async () => {
    const integrationId = '123';

    await disconnectCalendar(integrationId);

    expect(api.delete).toHaveBeenCalledWith(`/calendar/integrations/${integrationId}/`);
  });

  it('syncCalendarEvents faz a chamada correta para a API', async () => {
    const integrationId = '123';
    const mockResponse = {
      data: {
        syncedEvents: 5,
        conflicts: 0,
        success: true
      }
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await syncCalendarEvents(integrationId);

    expect(api.post).toHaveBeenCalledWith(`/calendar/integrations/${integrationId}/sync/`);
    expect(result).toEqual(mockResponse.data);
  });

  it('connectCalendar faz a chamada correta para a API', async () => {
    const provider = 'google';
    const authCode = 'auth-code-123';
    const mockResponse = {
      data: {
        id: '123',
        provider: 'google',
        name: 'Google Calendar',
        email: 'user@example.com',
        connected: true
      }
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await connectCalendar(provider, authCode);

    expect(api.post).toHaveBeenCalledWith('/calendar/integrations/', {
      provider,
      authCode
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('getCalendarIntegrations faz a chamada correta para a API', async () => {
    const mockResponse = {
      data: [
        {
          id: '123',
          provider: 'google',
          name: 'Google Calendar',
          email: 'user@example.com',
          connected: true
        }
      ]
    };

    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getCalendarIntegrations();

    expect(api.get).toHaveBeenCalledWith('/calendar/integrations/');
    expect(result).toEqual(mockResponse.data);
  });
});