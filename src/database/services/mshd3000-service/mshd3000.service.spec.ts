import { Test, TestingModule } from '@nestjs/testing';
import { MSHD3000Service } from './mshd3000.service';

describe('AppSettingsService', () => {
  let service: MSHD3000Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MSHD3000Service],
    }).compile();

    service = module.get<MSHD3000Service>(MSHD3000Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
