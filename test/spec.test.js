import { jest } from '@jest/globals'
import request from 'supertest';
import app from '../server/server.js';
import adminModel from '../server/api/v1/admin/adminModel.js';
import customTypes from '../server/utils/customTypes.js';

let adminUserToken, newAdmin;
let frameZeroStock, lenseZeroStock, frameWithStock, lenseWithStock;

jest.setTimeout(10000);

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
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token.length > 0).toBeTruthy();
    adminUserToken = res.body.token;
    //return res;
  });
});

describe('Admin Frames', () => {
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
  test('Should add a frame with zero stock', async () => {
    const res = await request(app).post('/api/v1/admins/frames').set('Authorization', `Bearer ${adminUserToken}`).send({
      name: 'Frame dummy 2',
      description: 'Dummy description 2',
      status: customTypes.frameStatus.ACTIVE,
      stock: 0,
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
    frameZeroStock = res.body.data;
  });
  test('Should add a frame with available stock', async () => {
    const res = await request(app).post('/api/v1/admins/frames').set('Authorization', `Bearer ${adminUserToken}`).send({
      name: 'Frame dummy 3',
      description: 'Dummy description 3',
      status: customTypes.frameStatus.ACTIVE,
      stock: 100,
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
    frameWithStock = res.body.data;
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

describe('Admin Lenses', () => {
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
  test('Should add a lense with zero stock', async () => {
    const res = await request(app).post('/api/v1/admins/lenses').set('Authorization', `Bearer ${adminUserToken}`).send({
      colour: 'blue',
      description: 'Dummy description 2',
      prescriptionType: customTypes.prescriptionType.FASHION,
      lenseType: customTypes.lenseType.CLASSIC,
      stock: 0,
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
    lenseZeroStock = res.body.data;
  });
  test('Should add a lense with available stock', async () => {
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
    lenseWithStock = res.body.data;
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


describe('User Frames', () => {
  test('Should get all active frames', async () => {
    const res = await request(app).get('/api/v1/users/frames');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length > 0).toBeTruthy();
  });
  test('Should get a specific frame', async () => {
    const res = await request(app).get(`/api/v1/users/frames/${frameWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frameWithStock._id).toBeTruthy();
  });
});


describe('User Lenses', () => {
  test('Should get all active lenses', async () => {
    const res = await request(app).get('/api/v1/users/lenses');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length > 0).toBeTruthy();
  });
  test('Should get a specific lense', async () => {
    const res = await request(app).get(`/api/v1/users/lenses/${lenseWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lenseWithStock._id).toBeTruthy();
  });
});

describe('Glasses', () => {
  test('Should not be able to add glasses with frame not in stock', async () => {
    const res = await request(app).post('/api/v1/users/glasses?currency=GBP').send({
      frameId: frameZeroStock._id,
      lenseId: lenseWithStock._id,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.data).toBeUndefined();
  });
  test('Should not be able to add glasses with lense not in stock', async () => {
    const res = await request(app).post('/api/v1/users/glasses?currency=GBP').send({
      frameId: frameWithStock._id,
      lenseId: lenseZeroStock._id,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.data).toBeUndefined();
  });
  let newGlasses;
  test('Should be able to add glasses with lense and frame available in stock', async () => {
    const res = await request(app).post('/api/v1/users/glasses?currency=GBP').send({
      frameId: frameWithStock._id,
      lenseId: lenseWithStock._id,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.price > 0).toBeTruthy();
    newGlasses = res.body.data;
  });
  test('Should check if frame was decremented from stock', async () => {
    const res = await request(app).get(`/api/v1/users/frames/${frameWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frameWithStock._id).toBeTruthy();
    expect(res.body.data.stock === (frameWithStock.stock - 1)).toBeTruthy();
  });
  test('Should check if lense was decremented from stock', async () => {
    const res = await request(app).get(`/api/v1/users/lenses/${lenseWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lenseWithStock._id).toBeTruthy();
    expect(res.body.data.stock === (lenseWithStock.stock - 1)).toBeTruthy();
  });
  test('Should get a specific glasses', async () => {
    const res = await request(app).get(`/api/v1/users/glasses/${newGlasses._id}?currency=GBP`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === newGlasses._id).toBeTruthy();
  });
  test('Should remove a specific glasses', async () => {
    const res = await request(app).delete(`/api/v1/users/glasses/${newGlasses._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === newGlasses._id).toBeTruthy();
  });
  test('Should check if frame stock was incremented after deletion of glasses', async () => {
    const res = await request(app).get(`/api/v1/users/frames/${frameWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frameWithStock._id).toBeTruthy();
    expect(res.body.data.stock === frameWithStock.stock).toBeTruthy();
  });
  test('Should check if lense stock was incremented after deletion of glasses', async () => {
    const res = await request(app).get(`/api/v1/users/lenses/${lenseWithStock._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lenseWithStock._id).toBeTruthy();
    expect(res.body.data.stock === lenseWithStock.stock).toBeTruthy();
  });
});

describe('Cleaning', () => {
  test('Should remove a frame with stock', async () => {
    const res = await request(app).delete(`/api/v1/admins/frames/${frameWithStock._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frameWithStock._id).toBeTruthy();
  });
  test('Should remove a frame with zero stock', async () => {
    const res = await request(app).delete(`/api/v1/admins/frames/${frameZeroStock._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === frameZeroStock._id).toBeTruthy();
  });
  test('Should remove a lense with stock', async () => {
    const res = await request(app).delete(`/api/v1/admins/lenses/${lenseWithStock._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lenseWithStock._id).toBeTruthy();
  });
  test('Should remove a lense with zero stock', async () => {
    const res = await request(app).delete(`/api/v1/admins/lenses/${lenseZeroStock._id}`).set('Authorization', `Bearer ${adminUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id === lenseZeroStock._id).toBeTruthy();
  });
});