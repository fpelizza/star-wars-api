import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { AppModule } from 'src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

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
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: 'e2e@test.com',
        name: 'E2E User',
        role: 'USER',
      });

      return request(app.getHttpServer() as any)
        .post('/auth/register')
        .send({
          email: 'e2e@test.com',
          password: 'password123',
          name: 'E2E User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe('e2e@test.com');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer() as any)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login and return a token', async () => {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password123', 10);

      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 1,
        email: 'e2e@test.com',
        password: hashedPassword,
        role: 'USER',
      });

      return request(app.getHttpServer() as any)
        .post('/auth/login')
        .send({
          email: 'e2e@test.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should return 401 for wrong credentials', () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      return request(app.getHttpServer() as any)
        .post('/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});
