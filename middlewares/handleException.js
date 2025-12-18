function handleException(err, req, res, next){
    console.error('Erro:', err.stack);
    res.status(500).render('500');
}

module.exports = handleException