import { Test, TestingModule } from '@nestjs/testing';
import { GeminiService } from './gemini.service.js';
import { GEMINI_CLIENT } from '../../app.module.js';

describe('GeminiService', () => {
  let service: GeminiService;
  let mockGeminiClient: {
    models: {
      generateContent: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    mockGeminiClient = {
      models: {
        generateContent: vi.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        { provide: GEMINI_CLIENT, useValue: mockGeminiClient },
        // {
        //   provide: ConfigService,
        //   useValue: {
        //     getOrThrow: vi.fn().mockReturnValue('mock-gemini-api-key'),
        //     get: vi.fn().mockReturnValue('mock-gemini-api-key'),
        //   },
        // },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
  });

  it('The service should be constructed properly', () => {
    expect(service).toBeDefined();
  });

  it('should respond to 503 wrapping the original cause');
});
