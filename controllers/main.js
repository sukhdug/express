exports.home = function (req, res, next) {
  res.render('main/home', {
    title: "It is title",
    message: "It is message"
  });
}
