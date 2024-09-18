const jwtMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json('No token provided, authorization denied');
    }

    try {
        const jwtResponse = jwt.verify(token, 'supersecretkey'); 
        req.payload = jwtResponse;
        next(); 
    } catch (error) {
        res.status(401).json('Authorization failed, invalid token');
    }
};

module.exports = jwtMiddleware;
