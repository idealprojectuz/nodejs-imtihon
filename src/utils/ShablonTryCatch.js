const MyFn = async (req, res, handler) => {
  try {
    await handler(req, res);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: 500, message: "invalid request", err: String(e) });
  }
};

module.exports = MyFn;
