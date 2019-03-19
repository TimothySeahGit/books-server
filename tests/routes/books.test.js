const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

const { MongoMemoryServer } = require("mongodb-memory-server");

const Book = require("../../models/book");

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

describe("Books Inventory", () => {
  let mongoServer;
  beforeAll(async () => {
    jest.setTimeout(60000);
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    mongoose.connect(mongoUri);
    // const createdBooks = await Promise.all(
    //   books.map(async book => {
    //     const createdBook = await Book.create(book); // Model.create is a mongoose API on the Model
    //     return createdBook;
    //   })
    // );
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("Getting Books", () => {
    const route = "/api/v1/books";
    const db = mongoose.connection;
    beforeEach(
      async () =>
        await Book.insertMany([
          {
            title: "the old man and the sea",
            author: "i dunno"
          },
          { title: "1984", author: "George Orwell" },
          { title: "Dune", author: "Frank Herbert" }
        ])
    );

    afterEach(() => {
      db.dropCollection("books");
    });

    test("Gets all books", () => {
      const expectedBooks = [
        {
          title: "the old man and the sea",
          author: "i dunno"
        },
        { title: "1984", author: "George Orwell" },
        {}
      ];
      return request(app)
        .get(route)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          const books = res.body;

          expect(books.length).toBe(expectedBooks.length);

          books.forEach((book, index) =>
            expect(book).toEqual(expect.objectContaining(expectedBooks[index]))
          );
        });
    });
    test("Gets a specific book", () => {
      const expectedBooks = [{ title: "1984", author: "George Orwell" }];

      return (
        request(app)
          .get("/api/v1/books?author=George Orwell")
          .expect(200)
          .expect("Content-Type", /json/)
          // .expect([{ id: "2", title: "1984", author: "George Orwell", qty: "3" }])
          .then(res => {
            const books = res.body;
            books.forEach((book, index) =>
              expect(book).toEqual(
                expect.objectContaining(expectedBooks[index])
                // expect(book.title).toBe(expectedBooks[index].title)
              )
            );
          })
      );
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

    test("Creates a new book with authorization token", async () => {
      const res = await request(app)
        .post(route)
        .set("Authorization", "Bearer my-awesome-token")
        .send({ title: "Cookbook", author: "Jamie Oliver" })
        .expect(201);
      expect(res.body.title).toEqual("Cookbook");
      expect(res.body.author).toEqual("Jamie Oliver");
      const book = await Book.findOne({
        title: "Cookbook",
        author: "Jamie Oliver"
      });
      expect(book.title).toBe("Cookbook");
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
    const route = (params = "") => {
      const path = "/api/v1/books";
      return `${path}/${params}`;
    };
    const db = mongoose.connection;
    beforeEach(
      async () =>
        await Book.insertMany([
          {
            title: "the old man and the sea",
            author: "i dunno"
          },
          { title: "1984", author: "George Orwell" },
          { title: "Dune", author: "Frank Herbert" }
        ])
    );

    // afterEach(() => {
    //   db.dropCollection("books");
    // });

    test("forbids access with no authorization", done => {
      request(app)
        .put(route(3))
        .send({ id: "3", title: "Dune", author: "Frank Herbert", qty: "50" })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
          done();
        });
    });
    test("forbids access with invalid authorization", done => {
      request(app)
        .put(route(3))
        .set("Authorization", "Bearer my-wrong-token")
        .send({ id: "3", title: "Dune", author: "Frank Herbert", qty: "50" })
        .ok(res => res.status === 403)
        .end(done);
    });

    test("allows access with valid authorization", async () => {
      const { _id } = await Book.findOne({ title: "1984" });
      await request(app)
        .put(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .send({
          title: "The Perennial Philosophy",
          author: "Aldous Huxley"
        })
        .expect(202)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              title: "The Perennial Philosophy",
              author: "Aldous Huxley"
            })
          );
        });
    });

    test("Delete a book successfully", async () => {
      const { _id } = await Book.findOne({ title: "1984" });
      await request(app)
        .delete(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .expect(202);

      const book = await Book.findById(_id);
      expect(book).toEqual(null);
    });
    test("fails as there is no such book", async () => {
      const { _id } = await "5c8fb5c41529bf25dcba41a7";
      await request(app)
        .delete(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .expect(404);
    });
  });
});
