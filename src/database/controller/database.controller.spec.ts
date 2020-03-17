import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseController } from './database.controller';

describe('AppSettings Controller', () => {
  let controller: DataBaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataBaseController],
    }).compile();

    controller = module.get<DataBaseController>(DataBaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
