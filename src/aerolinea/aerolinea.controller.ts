/* eslint-disable prettier/prettier */

import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {BusinessErrorsInterceptor} from "../shared/interceptors/business-errors.interceptor";
import {AerolineaService} from "./aerolinea.service";
import {plainToInstance} from "class-transformer";
import {AerolineaDto} from "./aerolinea.dto";
import {AerolineaEntity} from "./aerolinea.entity";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airlines')
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) {}

    @Get()
    async findAll() {
        return await this.aerolineaService.findAll();
    }

    @Get(':aerolineaID')
    async findOne(@Param('aerolineaID') aerolineaID: number) {
        return await this.aerolineaService.findOne(aerolineaID);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.create(aerolinea);
    }

    @Put(':aerolineaID')
    async update(@Param('aerolineaID') aerolineaID: number, @Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.update(aerolineaID, aerolinea);
    }

    @Delete(':aerolineaID')
    @HttpCode(204)
    async delete(@Param('aerolineaID') aerolineaID: number) {
        return await this.aerolineaService.delete(aerolineaID);
    }
}
