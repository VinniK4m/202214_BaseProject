/* eslint-disable prettier/prettier */

import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import {plainToInstance} from "class-transformer";
import {AerolineasAeropuertosService} from "./aerolineas-aeropuertos.service";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";
import {AeropuertoDto} from "../aeropuerto/aeropuerto.dto";

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineasAeropuertosController {
    constructor(private readonly aerolineasAeropuertosService: AerolineasAeropuertosService){}

    @Post(':aerolineaID/airports/:aeropuertoID')
    async adicionarAeropuertoAAerolinea(@Param('aerolineaID') aerolineaID: number, @Param('aeropuertoID') aeropuertoID: number){
        return await this.aerolineasAeropuertosService.adicionarAeropuertoAerolinea(aerolineaID, aeropuertoID);
    }

    @Get(':aerolineaID/airports/:aeropuertoID')
    async buscarAeropuertoXaerolineaIDaeropuertoID(@Param('aerolineaID') aerolineaID: number, @Param('aeropuertoID') aeropuertoID: number){
        return await this.aerolineasAeropuertosService.buscarAeropuertoXAerolineaIDAeropuertoID(aerolineaID, aeropuertoID);
    }

    @Get(':aerolineaID/airports')
    async buscarAeropuertosXaerolineaID(@Param('aerolineaID') aerolineaID: number){
        return await this.aerolineasAeropuertosService.buscarAeropuertosXAerolineaCodigo(aerolineaID);
    }

    @Put(':aerolineaID/airports')
    async asociarAeropuertosAerolinea(@Body() aeropuertoDto: AeropuertoDto[], @Param('aerolineaID') aerolineaID: number){
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertoDto)
        return await this.aerolineasAeropuertosService.asociarAeropuertosAerolinea(aerolineaID, aeropuertos);
    }

    @Delete(':aerolineaID/airports/:aeropuertoID')
    @HttpCode(204)
    async borrarAeropuertoAerolinea(@Param('aerolineaID') aerolineaID: number, @Param('aeropuertoID') aeropuertoID: number){
        return await this.aerolineasAeropuertosService.borrarAeropuertoAerolinea(aerolineaID, aeropuertoID);
    }
}
