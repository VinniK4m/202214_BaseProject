/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineasAeropuertosService } from './aerolineas-aeropuertos.service';
import { faker } from '@faker-js/faker';
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import {getRepositoryToken} from "@nestjs/typeorm";
import {AerolineaEntity} from "../aerolinea/aerolinea.entity";
import {Repository} from "typeorm";
import {AeropuertoEntity} from "../aeropuerto/aeropuerto.entity";

describe('AerolineasAeropuertosService', () => {
  let service: AerolineasAeropuertosService;

  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineasAeropuertosService],
    }).compile();

    service = module.get<AerolineasAeropuertosService>(AerolineasAeropuertosService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });


  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({

        nombre: faker.company.name(),
        codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
        ciudad: faker.address.city(),
        pais: faker.address.country(),

      })
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.image.imageUrl(),
      aeropuertos: aeropuertosList
    })
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('add aeropuertoaerolinea  should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.image.imageUrl(),
    })

    const otraAerolinea: AerolineaEntity = await service.adicionarAeropuertoAerolinea(newAerolinea.id , newAeropuerto.id);

    expect(otraAerolinea.aeropuertos.length).toBe(1);
    console.log(otraAerolinea.aeropuertos.length)
    expect(otraAerolinea.aeropuertos[0]).not.toBeNull();
    expect(otraAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo)
    expect(otraAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
    expect(otraAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad)

  });

  it('add aeropuertoaerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.image.imageUrl(),
    })

    await expect(() => service.adicionarAeropuertoAerolinea(newAerolinea.id, "10")).rejects.toHaveProperty("message", "El aeropuerto no se encontró");
  });

  it('addaeropuertoaerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    await expect(() => service.adicionarAeropuertoAerolinea("10", newAeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea no se encontró");
  });

  it('findaeropuertoByaerolineaIdaeropuertoId should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuertoModif: AeropuertoEntity = await service.buscarAeropuertoXAerolineaIDAeropuertoID(aerolinea.id, aeropuerto.id )
    expect(aeropuertoModif).not.toBeNull();
    expect(aeropuertoModif.codigo).toBe(aeropuerto.codigo);
    expect(aeropuertoModif.nombre).toBe(aeropuerto.nombre);
    expect(aeropuertoModif.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findaeropuertoByaerolineaIdaeropuertoId should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.buscarAeropuertoXAerolineaIDAeropuertoID(aerolinea.id, "10")).rejects.toHaveProperty("message", "El aeropuerto no se encontró");
  });

  it('findaeropuertoByaerolineaIdaeropuertoId should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.buscarAeropuertoXAerolineaIDAeropuertoID("10", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea no se encontró");
  });

  it('findaeropuertoByaerolineaIdaeropuertoId should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    await expect(()=> service.buscarAeropuertoXAerolineaIDAeropuertoID(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto que se desea borrar no esta asociado a una aerolinea");
  });

  it('findaeropuertosByaerolineaId should return aeropuertos by aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.buscaraeropuertosXAerolineaCodigo(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findaeropuertosByaerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.buscaraeropuertosXAerolineaCodigo("10")).rejects.toHaveProperty("message", "La aerolinea no se encontró");
  });

  it('associateaeropuertosaerolinea should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    const aerolineaModificado: AerolineaEntity = await service.asociaraeropuertosAerolinea(aerolinea.id, [newAeropuerto]);
    expect(aerolineaModificado.aeropuertos.length).toBe(1);

    expect(aerolineaModificado.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(aerolineaModificado.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(aerolineaModificado.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('associateaeropuertosaerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    await expect(()=> service.asociaraeropuertosAerolinea("10", [newAeropuerto])).rejects.toHaveProperty("message", "La aerolinea no se encontró");
  });

  it('associateaeropuertosaerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "10";

    await expect(()=> service.asociaraeropuertosAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "El aeropuerto no se encontró");
  });

  it('deleteaeropuertoToaerolinea should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];

    await service.borrarAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const storedaerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedaeropuerto: AeropuertoEntity = storedaerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedaeropuerto).toBeUndefined();

  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.borrarAeropuertoAerolinea(aerolinea.id, "100")).rejects.toHaveProperty("message", "El aeropuerto no se encontró");
  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.borrarAeropuertoAerolinea("101", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea no se encontró");
  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }),
      ciudad: faker.address.city(),
      pais: faker.address.country()
    });

    await expect(()=> service.borrarAeropuertoAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto que se desea borrar no esta asociado a una aerolinea");
  });

});
