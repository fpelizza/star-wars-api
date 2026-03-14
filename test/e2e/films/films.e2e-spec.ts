import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/services/prisma.service';

describe('Films (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const mockPrismaService = {
    film: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
  };

  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    adminToken = await jwtService.signAsync({
      sub: 1,
      email: 'admin@test.com',
      role: 'ADMIN',
    });
    userToken = await jwtService.signAsync({
      sub: 2,
      email: 'user@test.com',
      role: 'USER',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/films (GET)', () => {
    it('should return all films', () => {
      mockPrismaService.film.findMany.mockResolvedValue([
        { id: 1, title: 'A New Hope', characters: [] },
      ]);

      return request(app.getHttpServer() as any)
        .get('/films')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].title).toBe('A New Hope');
        });
    });
  });

  describe('/films/:id (GET)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer() as any)
        .get('/films/1')
        .expect(401);
    });

    it('should return film with user token', () => {
      mockPrismaService.film.findFirst.mockResolvedValue({
        id: 1,
        title: 'A New Hope',
        characters: [],
        swapiId: '1',
      });

      return request(app.getHttpServer() as any)
        .get('/films/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('A New Hope');
        });
    });

    it('should return 404 when film does not exist', () => {
      mockPrismaService.film.findFirst.mockResolvedValue(null);

      return request(app.getHttpServer() as any)
        .get('/films/9999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('/films (POST)', () => {
    it('should return 403 for non-admin user', () => {
      return request(app.getHttpServer() as any)
        .post('/films')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'New Film',
          episodeId: 1,
          director: 'D',
          openingCrawl: 'C',
        })
        .expect(403);
    });

    it('should create film as admin', () => {
      const filmData = {
        title: 'New Film',
        episodeId: 7,
        director: 'JJ',
        openingCrawl: 'Crawl',
      };
      mockPrismaService.film.create.mockResolvedValue({
        id: 1001,
        ...filmData,
        characters: [],
      });

      return request(app.getHttpServer() as any)
        .post('/films')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(filmData)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('New Film');
        });
    });

    it('should return 400 for invalid body when creating film as admin', () => {
      const invalidFilmData = { title: '', episodeId: null, director: 'JJ' };

      return request(app.getHttpServer() as any)
        .post('/films')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidFilmData)
        .expect(400);
    });
  });
});
