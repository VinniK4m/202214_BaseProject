/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly AeropuertoEntity: Repository<AeropuertoEntity>,
    ) {}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.AeropuertoEntity.find({

        });
    }
    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.AeropuertoEntity.findOne({where: {id} } );
        if (!aeropuerto)
            throw new BusinessLogicException(
                'El aeropuerto que consulta no existe',
                BusinessError.NOT_FOUND,
            );

        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        if (aeropuerto.codigo.length != 3)
            throw new BusinessLogicException(
                'El código del aeropuerto debe ser 3',
                BusinessError.NOT_FOUND,
            );


        return await this.AeropuertoEntity.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto: AeropuertoEntity = await this.AeropuertoEntity.findOne({
            where: { id },
        });
        if (!persistedAeropuerto)
            throw new BusinessLogicException(
                'El aeropuerto que actualiza no existe',
                BusinessError.NOT_FOUND,
            );

        aeropuerto.id = id;

        return await this.AeropuertoEntity.save(aeropuerto);
    }
    async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.AeropuertoEntity.findOne({
            where: { id },
        });
        if (!aeropuerto)
            throw new BusinessLogicException(
                'El aeropuerto que borra no existe',
                BusinessError.NOT_FOUND,
            );

        await this.AeropuertoEntity.remove(aeropuerto);
    }
}
