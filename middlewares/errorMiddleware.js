const errorMiddleware = {
    errorHandler: (err, req, res, next) => {

		console.error('Erreur capturée :', err);

		//	Détermine	le	code	de	statut	HTTP	
		const status = err.status || 500;

		//	Structure	de	la	réponse	envoyée	au	client	
		res.status(status).json({	
				error:	err.name || 'ServerError',	
				message: err.message || 'Une erreur interne est survenue',	
				timestamp: new Date().toISOString(),	
				path: req.originalUrl	
		});	
}
};

module.exports = errorMiddleware;	