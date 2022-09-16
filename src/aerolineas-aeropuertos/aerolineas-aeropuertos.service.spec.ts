/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineasAeropuertosService } from './aerolineas-aeropuertos.service';

describe('AerolineasAeropuertosService', () => {
  let service: AerolineasAeropuertosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineasAeropuertosService],
    }).compile();

    service = module.get<AerolineasAeropuertosService>(AerolineasAeropuertosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
