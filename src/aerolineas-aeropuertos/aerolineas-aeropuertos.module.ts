/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AerolineasAeropuertosService } from './aerolineas-aeropuertos.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";
import { AerolineasAeropuertosController } from './aerolineas-aeropuertos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineasAeropuertosService],
  controllers: [AerolineasAeropuertosController]
})
export class AerolineasAeropuertosModule {}
