/* eslint-disable prettier/prettier */

import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {BusinessErrorsInterceptor} from "../shared/interceptors/business-errors.interceptor";
import {plainToInstance} from "class-transformer";

import {AeropuertoService} from "./aeropuerto.service";
import {AeropuertoEntity} from "./aeropuerto.entity";
import {AeropuertoDto} from "./aeropuerto.dto";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airports')
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) {}

    @Get()
    async findAll() {
        return await this.aeropuertoService.findAll();
    }

    @Get(':aeropuertoID')
    async findOne(@Param('aeropuertoID') aeropuertoID: number) {
        return await this.aeropuertoService.findOne(aeropuertoID);
    }

    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeropuertoService.create(aeropuerto);
    }

    @Put(':aeropuertoID')
    async update(@Param('aeropuertoID') aeropuertoID: number, @Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeropuertoService.update(aeropuertoID, aeropuerto);
    }

    @Delete(':aeropuertoID')
    @HttpCode(204)
    async delete(@Param('aeropuertoID') aeropuertoID: number) {
        return await this.aeropuertoService.delete(aeropuertoID);
    }
}
