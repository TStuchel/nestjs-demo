import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from './app.module'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

// Helper method to initialize the Nest environment w/dependencies
const initializeNest = async (): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
    ],
  })
    .compile()
  return await moduleRef.createNestApplication().init()
}

describe('AppController', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await initializeNest()
  })

  //--
  describe('Given the root URL is accessed to perform a health check', () => {

    it('should return an "Service active!"', (done) => {
      request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((response) => {
          expect(response.text).toBe("Service active!")
        })
        .end(done)
    })

  })

});
