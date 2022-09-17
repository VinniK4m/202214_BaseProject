/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AerolineasAeropuertosService } from './aerolineas-aeropuertos.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineasAeropuertosService]
})
export class AerolineasAeropuertosModule {}
