const jwt = require("jsonwebtoken")

module.exports = {
     verifyToken:(req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];
        console.log(authHeader);

        const secret = process.env.JwtSecret||'Key';

        if (!authHeader) return res.status(401).json({ error: "Un Authrized User1" });

        const bearerToken = authHeader.split(' ');

        const token = bearerToken[1];

        jwt.verify(token, secret, (err, payload) => {

            if (err) {
                console.log(err);

                const message = err.name = 'JsonWebTokenError' ? 'Un Authrized User' : err.message;

                return res.json({ error1: message });
            }

            req.payload = payload;

            next();
        })
    } catch (err) {
        console.error(err.message)
        // return res.json(err)
    }


}
}