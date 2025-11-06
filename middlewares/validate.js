module.exports = (schema) => (req, res, next) => {

    const { error } = schema.validate(req.body, { abortEarly: false, convert: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation échouée',
            details: error.details.map(d => d.message)
        });
    }
    next();
};
