import { Test, TestingModule } from '@nestjs/testing';
import { MenssageService } from './menssage.service';

describe('MenssageService', () => {
  let service: MenssageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenssageService],
    }).compile();

    service = module.get<MenssageService>(MenssageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
