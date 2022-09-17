/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class AerolineasAeropuertosService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,

        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) {}

    async adicionarAeropuertoAerolinea(aerolineaID: string, aeropuertoID: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoID}});
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto no se encontró", BusinessError.NOT_FOUND);

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]})
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    async buscarAeropuertoXAerolineaIDAeropuertoID(aerolineaID: string, aeropuertoID: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoID}});
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto no se encontró", BusinessError.NOT_FOUND)

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND)

        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);

        if (!aerolineaAeropuerto)
            throw new BusinessLogicException("El aeropuerto que se desea borrar no esta asociado a una aerolinea", BusinessError.PRECONDITION_FAILED)

        return aerolineaAeropuerto;
    }

    async buscarAeropuertosXAerolineaCodigo(aerolineaID: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND)

        return aerolinea.aeropuertos;
    }

    async asociarAeropuertosAerolinea(aerolineaID: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]});

        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND)

        for (let i = 0; i < aeropuertos.length; i++) {
            const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}});
            if (!aeropuerto)
                throw new BusinessLogicException("El aeropuerto no se encontró", BusinessError.NOT_FOUND)
        }

        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
    }

    async borrarAeropuertoAerolinea(aerolineaID: string, aeropuertoID: string){
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoID}});
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto no se encontró", BusinessError.NOT_FOUND)

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND)

        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.codigo === aeropuerto.codigo);

        if (!aerolineaAeropuerto)
            throw new BusinessLogicException("El aeropuerto que se desea borrar no esta asociado a una aerolinea", BusinessError.PRECONDITION_FAILED)

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoID);
        await this.aerolineaRepository.save(aerolinea);
    }

    async borrarAeropuertosAerolinea(aerolineaID: string){

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaID}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea no se encontró", BusinessError.NOT_FOUND)


        if (aerolinea.aeropuertos.length == 0)
            throw new BusinessLogicException("La aerolinea no tiene asociado aeropuertos", BusinessError.PRECONDITION_FAILED)

        aerolinea.aeropuertos = [];
        await this.aerolineaRepository.save(aerolinea);
    }
}
