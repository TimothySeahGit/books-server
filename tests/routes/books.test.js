const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

// mongoose.connect("mongodb://localhost/books-db-test");
// const db = mongoose.connection;

//add comment
// describe("Forbids access", () => {
//   describe("No authentication", () => {});
//   describe("Wrong authentication", () => {});
// });

// describe("Allows access", () => {
//   describe("Executes successfully", () => {
//     const token = " ";
//     const route = "/api/v1/books/3";
//   });
//   describe("Executes UNsuccessfully", () => {
//     const token = " ";
//     const route = "/api/v1/books/3";
//   });
// });

describe("Books Inventory", () => {
  let mongoServer;
  beforeAll(async () => {
    jest.setTimeout(60000);
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("Getting Books", () => {
    const route = "/api/v1/books";
    test("Gets all books", done => {
      request(app)
        .get(route)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(books)
        .end(done);
    });
    test("Gets a specific book", done => {
      request(app)
        .get("/api/v1/books?author=George Orwell")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect([{ id: "2", title: "1984", author: "George Orwell", qty: "3" }])
        .end(done);
    });
    test("forbids access with no authorization", done => {
      request(app)
        .post(route)
        .send({ title: "Cookbook", author: "Jamie Oliver", qty: "1" })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
          done();
        });
    });
    test("forbids access with invalid authorization", done => {
      request(app)
        .post(route)
        .set("Authorization", "Bearer my-wrong-token")
        .send({ title: "Cookbook", author: "Jamie Oliver", qty: "1" })
        .ok(res => res.status === 403)
        .end(done);
    });

    test("allows access with authorization token", done => {
      request(app)
        .post(route)
        .set("Authorization", "Bearer my-awesome-token")
        .send({ title: "Cookbook", author: "Jamie Oliver" })
        .expect(201)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              title: "Cookbook",
              author: "Jamie Oliver"
            })
          );
          done();
        });
    });
    xtest("Add a new book", () => {
      return request(app)
        .post(route)
        .send({ title: "Cookbook", author: "Jamie Oliver", qty: "1" })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(res => {
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body).toEqual({
            id: expect.any(String),
            title: "Cookbook",
            author: "Jamie Oliver",
            qty: "1"
          });
        });
    });
  });

  describe("Modifiying books", () => {
    const route = "/api/v1/books/3";

    test("forbids access with no authorization", done => {
      request(app)
        .put(route)
        .send({ id: "3", title: "Dune", author: "Frank Herbert", qty: "50" })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
          done();
        });
    });
    test("forbids access with invalid authorization", done => {
      request(app)
        .put(route)
        .set("Authorization", "Bearer my-wrong-token")
        .send({ id: "3", title: "Dune", author: "Frank Herbert", qty: "50" })
        .ok(res => res.status === 403)
        .end(done);
    });

    test("allows access with valid authorization", done => {
      request(app)
        .put(route)
        .set("Authorization", "Bearer my-awesome-token")
        .send({ id: "3", title: "Dune", author: "Frank Herbert", qty: "50" })
        .expect(202)
        .expect("Content-Type", /json/)
        .then(res => {
          expect(res.body).toEqual({
            id: "3",
            title: "Dune",
            author: "Frank Herbert",
            qty: "50"
          });
        });
      done();
    });

    xtest("Delete a book successfully", done => {
      request(app)
        .delete(route)
        .set("Authorization", "Bearer my-awesome-token")
        .expect(202)
        .expect("Content-Type", /json/)
        .then(res => {
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body).toEqual([
            {
              id: "1",
              title: "the old man and the sea",
              author: "i dunno",
              qty: "2"
            },
            { id: "2", title: "1984", author: "George Orwell", qty: "3" },
            { id: "4", title: "Cookbook", author: "Jamie Oliver", qty: "1" }
          ]);
        });
      done();
    });
    xtest("fails as there is no such book", done => {
      const id = "100";
      request(app)
        .delete("/api/v1/books/100")
        .set("Authorization", "Bearer my-awesome-token")
        .expect(400, done);
    });
  });
});
