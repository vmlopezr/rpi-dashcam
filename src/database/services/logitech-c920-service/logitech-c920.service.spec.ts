import { Test, TestingModule } from '@nestjs/testing';
import { LogitechC920Service } from './logitech-c920.service';

describe('LogitechC920Service', () => {
  let service: LogitechC920Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogitechC920Service],
    }).compile();

    service = module.get<LogitechC920Service>(LogitechC920Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
