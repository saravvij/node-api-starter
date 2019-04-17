const request = require('supertest');
const app = require('../app');
const UserModel = require('./user.model');

beforeEach(async () => {
    await UserModel.deleteMany();
});

it('Should get greetings', async () => {
    await request(app)
        .get('/api/users/greetings')
        .expect(200);
});

it('Should signup user', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'testuser'
        })
        .expect(201);
});