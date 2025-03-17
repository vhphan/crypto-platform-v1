const router = require('express').Router();


module.exports = () => {
// Sample route
    router.get('/', (req, res) => {
        res.json({message: 'Hello from the sample route!'});
    });
    return router;
}
