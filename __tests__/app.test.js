const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

testData= require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
  });
  

afterAll(() => {
  if (db.end) db.end();
});

describe("Backend testing", () => {
  describe("GET /api/topics", () => {
    test("status:200, responds with an array of topic data", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("status :404 , get api/topiks, not found ", () => {
      return request(app)
        .get("/api/topiks")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});
