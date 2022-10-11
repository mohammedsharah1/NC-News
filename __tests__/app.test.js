const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

testData = require("../db/data/test-data/index");

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
  describe("GET api/articles/:article_id", () => {
    test("status 200: returns article by id", () => {
      const id = 1;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
        });
    });
    test("status: 400, unkown id", () => {
      const id = "hello";
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id");
        });
    });
    test("status:404, correct data type but id does not exist ", () => {
      const id = 287;
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("id not found");
        });
    });
  });
  describe.only("GET /api/users", () => {
    test("status:200, responds with an array of user data", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});
