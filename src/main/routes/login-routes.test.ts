import request from 'supertest'
import { hash } from 'bcrypt'

import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getColletion('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Leandro',
          email: 'leandrorevolve@gmail.com',
          password: '123qwe123',
          passwordConfirmation: '123qwe123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123qwe123', 12)
      
      await accountCollection.insertOne({
        name: 'Leandro',
        email: 'leandrorevolve@gmail.com',
        password,
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'leandrorevolve@gmail.com',
          password: '123qwe123',
        })
        .expect(200)
    })
  })
})
