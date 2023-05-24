const Io = require("../../../utils/Io");
const MyFn = require("../../../utils/ShablonTryCatch");
const schema = require("../../../schema/editbooks");
const path = require("path");
const io = new Io(
  path.join(__dirname, "..", "..", "..", "model", "books.json")
);
const authordata = new Io(
  path.join(__dirname, "..", "..", "..", "model", "authors.json")
);

const Get = async (req, res) => {
  const { category, authorId } = req.query;
  const data = await io.read();
  if (category) {
    res.status(200).json(data.filter((e) => e.category == category));
    return;
  }
  if (authorId) {
    res.status(200).json(data.filter((e) => e.authorId == authorId));
    return;
  }
  res.status(200).json(await io.read());
  return;
  //   const category = await sqlData("select * from category");
  //   res.status(200).json({ status: 200, data: category });
};
const GetById = async (req, res) => {
  const { id } = req.params;
  const data = await io.read();
  const search = data.find((e) => e.id == id);
  if (search) {
    const Authors = await authordata.read();
    const searchAuthor = Authors.find((e) => e.id == search.authorId);
    if (searchAuthor) {
      search.author = searchAuthor;
      res.status(200).json(search);
      return;
    }
  }
  throw new Error("book not found");
  // res.send("ok");
};
const Edit = async (req, res) => {
  const { id } = req.params;
  const allbooks = await io.read();
  const search = allbooks.find((e) => e.id == id);
  if (!search) {
    throw new Error("book not found");
  }
  const data = req.body;
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error);
  }
  const Authors = await authordata.read();
  const searchAuthor = Authors.find((e) => e.id == value.authorId);
  if (!searchAuthor) {
    throw new Error("Author not found");
  }
  search.title = value.title;
  search.category = value.category;
  search.authorId = value.authorId;
  await io.edit(allbooks);
  res.status(200).json({
    status: 200,
    message: "Successfully updated",
  });
};

const Delete = async (req, res) => {
  const { id } = req.params;
  const books = await io.read();
  if (!books.find((e) => e.id == id)) {
    throw new Error("Book not found");
  }
  const filtersbooks = books.filter((e) => e.id != id);
  await io.edit(filtersbooks);
  res.status(200).json({
    status: 200,
    message: "Succesfully deleted",
  });
};

const Add = async (req, res) => {
  const data = req.body;
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error);
  }
  const Authors = await authordata.read();
  const searchAuthor = Authors.find((e) => e.id == value.authorId);
  if (!searchAuthor) {
    throw new Error("Author not found");
  }
  await io.write({
    id: Authors[Authors.length - 1].id + 1 || 1,
    ...value,
  });
  res.status(200).json({
    status: 200,
    message: "Successfully created",
  });
  return;
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
