import { Test, TestingModule } from '@nestjs/testing';
import { GeminiService } from './gemini.service.js';
import { ConfigService } from '@nestjs/config';

describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn().mockReturnValue('mock-gemini-api-key'),
            get: vi.fn().mockReturnValue('mock-gemini-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
  });

  it('The service should be constructed properly', () => {
    expect(service).toBeDefined();
  });

  it('should respond to 503 wrapping the original cause');
});
