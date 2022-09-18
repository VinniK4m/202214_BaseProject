/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AerolineaEntity} from "./aerolinea.entity";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaEntity: Repository<AerolineaEntity>,
    ) {}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaEntity.find({relations: ['aeropuertos']});
    }
    async findOne(id: number): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaEntity.findOne({where: {id}, relations: ['aeropuertos'] } );
        if (!aerolinea)
            throw new BusinessLogicException(
                'La aerolinea que consulta no existe',
                BusinessError.NOT_FOUND,
            );

        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const hoy = new Date();
        const fundacion = new Date(aerolinea.fechaFundacion)

        if (fundacion > hoy)
            throw new BusinessLogicException(
                'La fecha de fundación de la aerolinea no puede ser futura',
                BusinessError.NOT_FOUND,
            );
        return await this.aerolineaEntity.save(aerolinea);
    }

    async update(id: number, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const hoy = new Date();

        if (aerolinea.fechaFundacion > hoy)
            throw new BusinessLogicException(
                'La fecha de fundación de la aerolinea no puede ser futura',
                BusinessError.NOT_FOUND,
            );
        const persisteAerolinea: AerolineaEntity = await this.aerolineaEntity.findOne({
            where: { id }, relations: ['aeropuertos']
        });
        if (!persisteAerolinea)
            throw new BusinessLogicException(
                'La aerolinea que actualiza no existe',
                BusinessError.NOT_FOUND,
            );

        aerolinea.id = id;

        return await this.aerolineaEntity.save(aerolinea);
    }
    async delete(id: number) {
        const aerolinea: AerolineaEntity = await this.aerolineaEntity.findOne({
            where: { id }, relations: ['aeropuertos']
        });
        if (!aerolinea)
            throw new BusinessLogicException(
                'La aerolinea que borra no existe',
                BusinessError.NOT_FOUND,
            );

        await this.aerolineaEntity.remove(aerolinea);
    }    
}
