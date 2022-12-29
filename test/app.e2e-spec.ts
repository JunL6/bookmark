import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { spec } from "pactum";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanDb();
  })

  afterAll(() => {
    app.close();
  })

  const LOCAL_HOST = 'http://localhost:3333';
  const dto = {
    email: '1234@mail.com',
    password: '1234',
  }

  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw if body is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/signup`)
          .expectStatus(400)
      })

      it('should throw if email is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/signup`)
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })

      it('should throw if passpord is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/signup`)
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })

      it('should signup', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/signup`)
          .withBody(dto)
          .expectStatus(201)
          .stores("acessToken", "access_token")
      })
    })

    describe('Login', () => {
      it('should throw if body is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/login`)
          .expectStatus(400)
      })

      it('should throw if email is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/login`)
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })

      it('should throw if passpord is not provided', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/login`)
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })

      it('should log in', async () => {
        await spec()
          .post(`${LOCAL_HOST}/auth/login`)
          .withBody(dto)
          .expectStatus(201)
          .stores("accessToken", "access_token")
      })


    })

  })

  describe("User", () => {
    describe("Get me", () => {
      it('should get user', async () => {
        await spec()
          .get(`${LOCAL_HOST}/user/me`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(200)
      })

    })

    describe("Edit user", () => {
      it.todo("should edit user")
    })
  })

  describe("Bookmark", () => {
    describe("Create bookmark", () => {
      it.todo("should create bookmark")
    })

    describe("Edit bookmark", () => {
      it.todo("should edit bookmark")
    })

    describe("Delete bookmark", () => {
      it.todo("should delete bookmark")
    })

    describe("Get bookmarks", () => {
      it.todo("should get bookmarks for a user")
    })

    describe("Get bookmark by id", () => {
      it.todo("should get bookmark by id")
    })
  })



})