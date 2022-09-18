/* eslint-disable prettier/prettier */

import {IsDateString, IsNotEmpty, IsString} from 'class-validator';

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    //@IsDate()
    @IsDateString()
    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsString()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
