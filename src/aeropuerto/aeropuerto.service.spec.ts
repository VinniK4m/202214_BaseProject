/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import {Repository} from "typeorm";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import {getRepositoryToken} from "@nestjs/typeorm";
import {faker} from "@faker-js/faker";
import {AeropuertoEntity} from "./aeropuerto.entity";


describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
        ciudad: faker.address.city(),
        pais: faker.address.country()
      })
      aeropuertoList.push(aeropuerto);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedaeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedaeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedaeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedaeropuerto.codigo)
    expect(aeropuerto.ciudad).toEqual(storedaeropuerto.ciudad)
    expect(aeropuerto.pais).toEqual(storedaeropuerto.pais)


  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne("10")).rejects.toHaveProperty("message", "El aeropuerto que consulta no existe")
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "0",
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      aerolineas: [],
    }

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedaeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.nombre).toEqual(newAeropuerto.nombre)
    expect(storedaeropuerto.codigo).toEqual(newAeropuerto.codigo)
    expect(storedaeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
    expect(storedaeropuerto.pais).toEqual(newAeropuerto.pais)
  });

  it('create should return a new aeropuerto with code 2 ', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "0",
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 2, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      aerolineas: [],
    }
    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty("message", "El código del aeropuerto debe ser 3")
  });

  it('create should return a new aeropuerto with code 4 ', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "0",
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 4, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      aerolineas: [],
    }
    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty("message", "El código del aeropuerto debe ser 3")
  });

  it('update should modify a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = "Nuevo nombre";
    aeropuerto.codigo = "Nuevo codigo";
    aeropuerto.ciudad = "Nueva ciudad";
    aeropuerto.pais = "Nueva pais";


    const updatedaeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedaeropuerto).not.toBeNull();

    const storedaeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedaeropuerto.codigo).toEqual(aeropuerto.codigo)
    expect(storedaeropuerto.ciudad).toEqual(aeropuerto.ciudad)

  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "nuevo nombre", codigo: "nueva codigo"
    }
    await expect(() => service.update("10", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto que actualiza no existe")
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);

    const deletedaeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedaeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto que borra no existe")
  });
});
