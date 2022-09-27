import request from "supertest";
import app from "../server/server.js";

describe('Frame API', () => {
    it('Get all frames', async () => {
      const res = await request(app)
        .get('/api/v1/frames')
      expect(res.statusCode).toEqual(200)
      //expect(res.body).toHaveProperty('post')
    })
});

export default {};