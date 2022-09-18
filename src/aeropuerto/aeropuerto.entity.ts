/* eslint-disable prettier/prettier */
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    ciudad: string;

    @Column()
    pais: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable()
    aerolineas: AerolineaEntity[];
}
