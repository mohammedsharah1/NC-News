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
            comment_count: 11,
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
          expect(body.msg).toBe("id does not exist");
        });
    });
  });
  describe("GET /api/users", () => {
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
  describe("PATCH /api/articles/:article_id", () => {
    test("status: 200, responds with the updated article when votes decremented", () => {
      const id = 1;
      const voteIncrement = { votes: -4 };
      return request(app)
        .patch(`/api/articles/${id}`)
        .send(voteIncrement)
        .expect(200)
        .then(({ body }) => {
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
  describe("GET /api/articles", () => {
    test("status: 200, responds with an array of all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);

          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                body: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
  });
  test("status: 200, responds with the correct topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([
          {
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2,
          },
        ]);
      });
  });
  test("status: 400, responds with invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=spud")
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("invalid topic");
      });
  });
  test("status: 200, accepts order by created_at", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("status: 200, responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(11);

          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                body: expect.any(String),
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 404, id does not exist", () => {
      const id = 999;
      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then((response) => {
          const {
            body: { msg },
          } = response;
          expect(msg).toBe("id not found");
        });
    });
  });
  test("status: 400, invalid id type", () => {
    const id = "steve";
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid id/vote");
      });
  });
  test("status:200, returns undefined when article does not have a comment", () => {
    const id = 8;
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.comments).toEqual(undefined);
      });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("status :201, new comment posted", () => {
      const id = 2;
      const newComment = {
        author: "rogersop",
        body: "some information",
      };
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .expect(201)
        .send(newComment)
        .then(({ body }) => {

          
          expect(body.comments).toEqual({
            comment_id: 19,
            author: "rogersop",
            body: "some information",
            article_id: 2,
            votes: 0,
            created_at: expect.any(String),
          });
          expect(body.comments).toEqual(
            expect.objectContaining({
              author: "rogersop",
              body: "some information",
            })
          );
        });
    });
    test("status:404, foreign key not found", () => {
      const id = 2;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "random author", body: "some stuff" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("foreign key/id not found");
        });
    });
    test("status:404, id does not exist ", () => {
      const id = 287;
      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({ author: "rogersop", body: "some information" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("foreign key/id not found");
        });
    });
  });
  test("status: 400, invalid id, wrong data type", () => {
    const id = "any id";
    return request(app)
      .post(`/api/articles/${id}/comments`)
      .send({ author: "rogersop", body: "some information" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id/vote");
      });
  });
  test("status: 400, bad request not correctly formatted", () => {
    const id = 2;
    return request(app)
      .post(`/api/articles/${id}/comments`)
      .send({ body: "some information" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request properties missing");
      });
  });
  test("status :201, ignores extra properties", () => {
    const id = 2;
    newComment = {
      author: "rogersop",
      body: "some information",
      random: "some extra information",
    };
    return request(app)
      .post(`/api/articles/${id}/comments`)
      .expect(201)
      .send(newComment)
      .then(({ body }) => {
        expect(body.comments).toEqual({
          comment_id: 19,
          author: "rogersop",
          body: "some information",
          article_id: 2,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
});

