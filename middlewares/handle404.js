function handle404(req, res, next){
    res.status(404).render('404');
}

module.exports = handle404