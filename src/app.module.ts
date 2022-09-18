/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import {AeropuertoEntity} from "./aeropuerto/aeropuerto.entity";
import {AerolineaEntity} from "./aerolinea/aerolinea.entity";
import { AerolineasAeropuertosModule } from './aerolineas-aeropuertos/aerolineas-aeropuertos.module';

@Module({
  imports: [AeropuertoModule,AerolineaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'parcialusr',
      password: '123456',
      database: 'gestionaereadb',
      entities: [AeropuertoEntity, AerolineaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AerolineasAeropuertosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
