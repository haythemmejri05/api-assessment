//import {jest} from '@jest/globals'
import request from 'supertest';
import app from '../server/server.js';
import adminModel from '../server/api/v1/admin/adminModel.js';
import customTypes from '../server/utils/customTypes.js';

let adminUserToken;
let newAdmin;

// Create a new Admin for testing
async function createNewAdmin() {
  const adminTestUser = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'test',
    password: 'test',
  };
  try {
    newAdmin = await adminModel.create(adminTestUser);
    console.info('New Admin created');
  } catch (err) {
    if (err.message.indexOf('duplicate key') !== -1) {
      newAdmin = await adminModel.findOne({ username: 'test' });
    }
  }
}

// Remove testing Admin
async function removeNewAdmin() {
  await newAdmin.remove((err, removed) => {
    if (!err) {
      //console.info('New Admin removed');
      newAdmin = null;
    } else {
      console.error(`Error while removing Admin: ${err}`);
    }
  });
}

beforeAll(async () => {
  await createNewAdmin();
});

afterAll(async () => {
  await removeNewAdmin();
  await new Promise(resolve => setTimeout(() => resolve(), 1000));
});

describe('Admin', () => {
  test('Should authenticate Admin', async () => {
    const res = await request(app).post('/api/v1/admins/authenticate').send({ username: 'test', password: 'test' });
    expect(res.statusCode).toEqual(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.token.length > 0).toBeTruthy()
    
    adminUserToken = res.body.token;
    //return res;
  });
});

describe('Frames', () => {
  let frame;
  test('Should add a frame', async () => {
    const res = await request(app).post('/api/v1/admins/frames').set('Authorization', `Bearer ${adminUserToken}`).send({
      name: 'Frame dummy 1',
      description: 'Dummy description 1',
      status: customTypes.frameStatus.ACTIVE,
      stock: 10,
      price: {
        USD: 109.9,
        GBP: 89.9,
        EUR: 99.9,
        JOD: 69.9,
        JPY: 299.9,
      }
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data._id).toBeTruthy();
    frame = res.body.data;
  });
  test('Should get all frames', async () => {
    const res = await request(app).get('/api/v1/admins/frames').set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length > 0).toBeTruthy();
  });
  test('Should update a frame', async () => {
    const res = await request(app).put(`/api/v1/admins/frames/${frame._id}`).set('Authorization', `Bearer ${adminUserToken}`).send({ stock: 99 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.stock === 99).toBeTruthy();
  });
  test('Should get a specific frame', async () => {
    const res = await request(app).get(`/api/v1/admins/frames/${frame._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frame._id).toBeTruthy();
  });
  test('Should remove a specific frame', async () => {
    const res = await request(app).delete(`/api/v1/admins/frames/${frame._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frame._id).toBeTruthy();
  });
});

describe('Lenses', () => {
  let lense;
  test('Should add a lense', async () => {
    const res = await request(app).post('/api/v1/admins/lenses').set('Authorization', `Bearer ${adminUserToken}`).send({
      colour: 'blue',
      description: 'Dummy description 1',
      prescriptionType: customTypes.prescriptionType.FASHION,
      lenseType: customTypes.lenseType.CLASSIC,
      stock: 100,
      price: {
        USD: 39.9,
        GBP: 19.9,
        EUR: 29.9,
        JOD: 9.9,
        JPY: 59.9,
      }
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data._id).toBeTruthy();
    lense = res.body.data;
  });
  test('Should get all lenses', async () => {
    const res = await request(app).get('/api/v1/admins/lenses').set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length > 0).toBeTruthy();
  });
  test('Should update a frame', async () => {
    const res = await request(app).put(`/api/v1/admins/lenses/${lense._id}`).set('Authorization', `Bearer ${adminUserToken}`).send({ stock: 99 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.stock === 99).toBeTruthy();
  });
  test('Should get a specific frame', async () => {
    const res = await request(app).get(`/api/v1/admins/lenses/${lense._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lense._id).toBeTruthy();
  });
  test('Should remove a specific lense', async () => {
    const res = await request(app).delete(`/api/v1/admins/lenses/${lense._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lense._id).toBeTruthy();
  });
});