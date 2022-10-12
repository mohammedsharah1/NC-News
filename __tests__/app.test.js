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
    test("status: 400, invalid id", () => {
      const id = "hello";
      return request(app)
        .get(`/api/articles/${id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id/vote");
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
  describe.only("PATCH /api/articles/:article_id", () => {
    test("status: 200, responds with the updated article when votes decremented", () => {
      const id = 1;
      const voteIncrement = { votes: -4 };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(200)
        .then(({ body }) => {
          // console.log(body)
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 96,
          });
          expect(body.article.votes).toBe(96);
        });
    });
    test("status: 200, responds with the updated article when votes incremented", () => {
      const id = 1;
      const voteIncrement = { votes: 4 };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(200)
        .then(({ body }) => {
          // console.log(body)
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 104,
          });
          expect(body.article.votes).toBe(104);
        });
    });
    test("status: 400, bad request invalid vote increment value", () => {
      const id = 1;
      const voteIncrement = { votes: "nothing to see here" };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id/vote");
        });
    });
    test("status: 400, bad request invalid id", () => {
      const id = "apples";
      const voteIncrement = { votes: 1 };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id/vote");
        });
    });
    test("status: 400, bad request when passed an empty object increment ", () => {
      const id = 1;
      const voteIncrement = {};
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("vote increment has not been provided");
        });
    });
  });
});
