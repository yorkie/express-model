
exports.HelloWorld = function (req, res, next) {

  var model = Model.use('yourModelName', function() {
    this.someVariable_1 = 1;
    this.someVariable_2 = 2;
  })
  res.render('yourViewName', model);

}