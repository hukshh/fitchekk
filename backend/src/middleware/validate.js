const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (!result.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: result.error.flatten().fieldErrors,
                });
            }

            // Replace with parsed (coerced/defaulted) values
            req.body = result.data.body ?? req.body;
            req.query = result.data.query ?? req.query;
            req.params = result.data.params ?? req.params;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validate;
