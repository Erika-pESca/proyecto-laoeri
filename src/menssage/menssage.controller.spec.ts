import { Test, TestingModule } from '@nestjs/testing';
import { MenssageController } from './menssage.controller';
import { MenssageService } from './menssage.service';

describe('MenssageController', () => {
  let controller: MenssageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenssageController],
      providers: [MenssageService],
    }).compile();

    controller = module.get<MenssageController>(MenssageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
