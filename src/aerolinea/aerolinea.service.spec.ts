/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import {Repository} from "typeorm";
import {AerolineaEntity} from "./aerolinea.entity";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import {getRepositoryToken} from "@nestjs/typeorm";
import {faker} from "@faker-js/faker";

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineaList = [];
    for(let i = 0; i < 5; i++){
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.paragraph(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.image.imageUrl(),
        aeropuertos: []})
      aerolineaList.push(aerolinea);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineaList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(storedAerolinea.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb)


  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findOne(10)).rejects.toHaveProperty("message", "La aerolinea que consulta no existe")
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.image.imageUrl(),
      aeropuertos: [],
    }

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb)
  });

  it('create should return a new aerolinea with future date', async () => {
    const aerolinea: AerolineaEntity = {
      id: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.future(2),
      paginaWeb: faker.image.imageUrl(),
      aeropuertos: [],
    }

    await expect(() => service.create(aerolinea)).rejects.toHaveProperty("message", "La fecha de fundación de la aerolinea no puede ser futura")

  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea.nombre = "Nuevo nombre";
    aerolinea.descripcion = "Nueva descripcion";
    aerolinea.paginaWeb = "Nueva pagina web";


    const updatedaerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedaerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
    expect(storedAerolinea.paginaWeb).toEqual(aerolinea.paginaWeb)

  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea, nombre: "nuevo nombre", descripcion: "nueva descripcion"
    }
    await expect(() => service.update(10, aerolinea)).rejects.toHaveProperty("message", "La aerolinea que actualiza no existe")
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);

    const deletedaerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedaerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "La aerolinea que borra no existe")
  });
});
