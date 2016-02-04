function index(app) {
    app.use('/', require('./spa').index());
}
exports.index = index;
