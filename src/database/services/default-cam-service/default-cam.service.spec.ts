import { Test, TestingModule } from '@nestjs/testing';
import { DefaultCamService } from './default-cam.service';

describe('DefaultCamService', () => {
  let service: DefaultCamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultCamService],
    }).compile();

    service = module.get<DefaultCamService>(DefaultCamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
