import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

export class TestAppBuilder {
  private app!: INestApplication;

  async build() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await this.app.init();
    return this;
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async close() {
    await this.app.close();
  }

  getApp() {
    return this.app;
  }
}

export const createTestApp = async (): Promise<{
  app: INestApplication;
  httpServer: any;
  close: () => Promise<void>;
}> => {
  const builder = await new TestAppBuilder().build();
  return {
    app: builder.getApp(),
    httpServer: builder.getHttpServer(),
    close: () => builder.close(),
  };
};

export const getAuthToken = async (httpServer: any, credentials: { email: string; password: string }) => {
  const response = await request(httpServer)
    .post('/api/auth/login')
    .send(credentials)
    .expect(201);
  
  return response.body.access_token;
};
