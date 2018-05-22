
// Check object to empty
var isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

// Check is authorized of user
var isLoggedIn = function(req, res, next) {
  if (isEmpty(req.session.authUser)) {
      res.redirect('/');
  } else if (req.session.authUser) {
    next();
  }
}

module.exports = {
  isEmpty: isEmpty,
  isLoggedIn: isLoggedIn
}
