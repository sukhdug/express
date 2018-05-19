exports.home = function (req, res, next) {
  res.render('main/home', {
    title: "It is title",
    message: "It is message"
  });
}

exports.registration = function (req, res, next) {
  res.render('main/reg', {
    title: "Registration",
    message: "It is registration page"
  });
  if (req.body) {
    console.log(req.body);
  }
}

exports.auth = function (req, res, next) {
  res.render('main/auth', {
    title: "Authorization",
    message: "It is authorization page"
  });
}
