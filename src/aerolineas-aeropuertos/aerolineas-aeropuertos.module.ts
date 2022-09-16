/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AerolineasAeropuertosService } from './aerolineas-aeropuertos.service';

@Module({
  providers: [AerolineasAeropuertosService]
})
export class AerolineasAeropuertosModule {}
