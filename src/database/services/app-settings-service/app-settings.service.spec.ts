import { Test, TestingModule } from '@nestjs/testing';
import { AppSettingsService } from './app-settings.service';

describe('AppSettingsService', () => {
  let service: AppSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppSettingsService],
    }).compile();

    service = module.get<AppSettingsService>(AppSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
