import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchController } from './freeswitch.controller';
import { FreeswitchService } from './freeswitch.service';

describe('FreeswitchController', () => {
  let controller: FreeswitchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeswitchController],
      providers: [FreeswitchService],
    }).compile();

    controller = module.get<FreeswitchController>(FreeswitchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
