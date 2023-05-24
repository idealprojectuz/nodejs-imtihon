const Io = require("../../../utils/Io");
const MyFn = require("../../../utils/ShablonTryCatch");
const path = require("path");
const Joi = require("joi");
const io = new Io(
  path.join(__dirname, "..", "..", "..", "model", "books.json")
);
const authordata = new Io(
  path.join(__dirname, "..", "..", "..", "model", "authors.json")
);

const Get = async (req, res) => {
  res.status(200).json(await authordata.read());
};
const GetById = async (req, res) => {
  const { id } = req.params;
  const authors = await authordata.read();
  const find = authors.find((e) => e.id == id);
  if (find) {
    const books = await io.read();
    let bookscount = books.filter((e) => e.authorId == id);
    find.countBooks = bookscount.length;
    res.status(200).json(find);
    return;
  }
  throw new Error("author not found");
};
const Edit = async (req, res) => {
  const authors = await authordata.read();
  const { id } = req.params;
  const search = authors.find((e) => e.id == id);
  if (!search) {
    throw new Error("Authors not found");
  }
  const { name } = req.body;
  const schema = Joi.string().min(3);
  const { error, value } = schema.validate(name);
  if (error) {
    throw new Error(error);
  }
  search.name = name;
  authordata.edit(authors);
  res.status(200).json({
    status: 200,
    message: "Successfully created",
  });
  return;
};
const Delete = async (req, res) => {
  const authors = await authordata.read();
  const { id } = req.params;
  const search = authors.find((e) => e.id == id);
  if (search) {
    const books = await io.read();
    const booksearch = books.filter((e) => e.authorId == id);
    if (booksearch.length) {
      throw new Error(
        "Author yozgan kitoblari mavjud ekan uni o`chirib bo`lmaydi"
      );
    }
    authordata.edit(authors.filter((e) => e.id != id));
    return res.status(200).json({
      status: 200,
      message: "deleted complate",
    });

    // console.log(authors.filter((e) => e.id != id));
  }
  throw new Error("Author not found");
};
const Add = async (req, res) => {
  const { name } = req.body;
  const schema = Joi.string().min(3);
  const { error, value } = schema.validate(name);
  if (error) {
    throw new Error(error);
  }
  const authorlar = await authordata.read();
  authordata.write({
    id: authorlar[authorlar.length - 1].id + 1 || 1,
    name: value,
  });
  res.status(200).json({
    status: 200,
    message: "Created successfully",
  });
};

class Controller {
  async Get(req, res) {
    MyFn(req, res, Get);
  }
  async Add(req, res) {
    MyFn(req, res, Add);
  }
  async Edit(req, res) {
    MyFn(req, res, Edit);
  }
  async GetById(req, res) {
    MyFn(req, res, GetById);
  }
  async Delete(req, res) {
    MyFn(req, res, Delete);
  }
}
module.exports = new Controller();
