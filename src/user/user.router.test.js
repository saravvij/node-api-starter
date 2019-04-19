const request = require('supertest');
const app = require('../app');
const UserModel = require('./user.model');

const testUser = {
    email: 'testuser@gmail.com',
    password: 'password123',
    name: 'testuser'
};


beforeEach(async () => {
    await UserModel.deleteMany();
});

it('Should signup user', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send(testUser)
        .expect(201);

    expect(response.body.id).not.toBeUndefined();
    expect(response.body.token).not.toBeUndefined();
});

it('Should not signup existing user', async () => {

    await UserModel.create(testUser);
    const response = await request(app)
        .post('/api/users/signup')
        .send(testUser)
        .expect(400);
    expect(response.body.id).toBeUndefined();
    expect(response.body.token).toBeUndefined();
    expect(response.body.message).toBe('The username ' + testUser.email + ' already exists, please try with different name.');
});

it('Should login user', async () => {
    const newUserResp = await request(app)
        .post('/api/users/signup')
        .send(testUser);

    const response = await request(app)
        .post('/api/users/login')
        .send(testUser)
        .expect(200);

    expect(response.body.id).toBe(newUserResp.body.id);
    expect(response.body.token).not.toBeUndefined();
});