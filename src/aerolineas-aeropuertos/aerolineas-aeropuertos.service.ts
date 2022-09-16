/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";

@Injectable()
export class AerolineasAeropuertosService {
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>

    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>
}
