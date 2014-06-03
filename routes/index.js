// provide route to the stream routes index
module.exports = function(app) {
  require('./stream')(app);
  require('./login')(app);
}

