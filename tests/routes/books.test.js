const request = require("supertest");
const app = require("../../app");

const books = [
  { id: "1", title: "the old man and the sea", author: "i dunno", qty: "2" },
  { id: "2", title: "1984", author: "George Orwell", qty: "3" },
  { id: "3", title: "Dune", author: "Frank Herbert", qty: "5" }
];

describe("Books Inventory", () => {
  describe("GET and POST", () => {
    const route = "/books";
    test("Gets all books", () => {
      return request(app)
        .get(route)
        .expect(200)
        .expect("Content-Type", /json/)
        .expect(books);
    });
    test("Add a new book", () => {
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
    const route = "/books/3";

    test("Modify a book", () => {});
    test("Delete a book", () => {
      return request(app)
        .delete(route)
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
    });
  });
});
