import request from "supertest";
import app from "../server/server.js";

describe('Frames', () => {
    it('Should get all frames', async () => {
      const res = await request(app)
        .get('/api/v1/frames');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toEqual(true);
      expect(res.body.data.length > 0).toEqual(true);
    })
});

export default {};