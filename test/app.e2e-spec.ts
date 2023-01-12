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
      it('should throw if body is not provided', async () => {
        await spec()
          .patch(`${LOCAL_HOST}/user`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(400)
      })

      it('should edit user', async () => {
        await spec()
          .patch(`${LOCAL_HOST}/user`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            firstName: 'Goku'
          })
          .expectStatus(200)
      })
    })
  })

  describe("Bookmark", () => {
    const bookmarkDto = {
      title: "background music",
      description: "music to listen to",
      link: "www.youtube.com"
    }
    const bookmarkId = 1;
    const bookmarkIdThatDoesNotBelongToThisUser = 2;
    const bookmarkIdThatDoesNotExist = 1000;
    const secondTitle = "Daft Punk";
    const secondLink = "www.spotify.com";
    // const userId = 1;

    describe("Create bookmark", () => {
      it("should throw if body is not provided", async () => {
        await spec()
          .post(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(400)
      })

      it("should throw if title is not provided", async () => {
        await spec()
          .post(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            description: bookmarkDto.description,
            link: bookmarkDto.link
          })
          .expectStatus(400)
      })

      it("should create bookmark", async () => {
        await spec()
          .post(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody(bookmarkDto)
          .expectStatus(201)
      })

      it("should throw if a bookmark with the same title already exists", async () => {
        await spec()
          .post(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            title: bookmarkDto.title,
            link: secondLink
          })
          .expectStatus(400)
      })

      it("should throw if a bookmark with the same link already exists", async () => {
        await spec()
          .post(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            title: secondTitle,
            link: bookmarkDto.link
          })
          .expectStatus(400)
      })
    })

    describe("Edit bookmark", () => {
      it("should throw if body is not provided", async () => {
        await spec()
          .patch(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(400)
      })

      it("should throw if title is not provided", async () => {
        await spec()
          .patch(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            description: bookmarkDto.description,
            link: bookmarkDto.link
          })
          .expectStatus(400)
      })

      it("should throw if the bookmark of this bookmarkId doesn't belong to current user", async () => {
        await spec()
          .patch(`${LOCAL_HOST}/bookmark?bookmarkId=${bookmarkIdThatDoesNotBelongToThisUser}`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(400)
      })

      it("should edit bookmark", async () => {
        await spec()
          .patch(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withQueryParams('bookmarkId', bookmarkId)
          .withBody({
            title: "new title",
            link: "new link"
          })
          .expectStatus(200)
      })
    })

    describe("Get bookmarks", () => {
      it("should get all bookmarks for a user", async () => {
        await spec()
          .get(`${LOCAL_HOST}/bookmark`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(200)
      })
      
    })

    describe("Get bookmark by id", () => {
      it("should get one specific bookmark by bookmarkId", async () => {
        await spec()
          .get(`${LOCAL_HOST}/bookmark?bookmarkId=${bookmarkId}`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(200)
      })
    })

    describe("Delete bookmark", () => {
      it("should throw if the bookmark of this bookmarkId doesn't belong to current user", async () => {
        await spec()
          .delete(`${LOCAL_HOST}/bookmark?bookmarkId=${bookmarkIdThatDoesNotBelongToThisUser}`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .expectStatus(400)
      })

      it("should throw if a bookmark of this id doesn't exist", async () => {
        await spec()
          .delete(`${LOCAL_HOST}/bookmark`)
          .withQueryParams('bookmarkId', bookmarkIdThatDoesNotExist)
          .withHeaders('Authorization', `bearer $S{accessToken}`)
          .expectStatus(400)
      })

      it("should delete bookmark by id", async () => {
        await spec()
          .delete(`${LOCAL_HOST}/bookmark?bookmarkId=${bookmarkId}`)
          .withHeaders('Authorization', 'bearer $S{accessToken}')
          .withBody({
            bookmarkId,
            bookmarkDto
          })
          .expectStatus(200)
      })
    })
  })



})