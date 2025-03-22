const router = require('express').Router();
require('dotenv').config();

const apiKey = process.env.COINGECKO_API_KEY;
const baseUrl = 'https://api.coingecko.com/api/v3'


module.exports = () => {

    router.get('/', (request, response) => {
        return response.status(404).send({
            message: 'No endpoint specified'
        })
    });

    router.get(['/coins/markets', '/coins/:id', '/coins/:id/market_chart'], async (request, response) => {
        const getParams = {
            ...request.query,
        };
        const path = request.path;
        const queryString = new URLSearchParams(getParams).toString();
        const finalUrl = `${baseUrl}${path}?${queryString}`;

        console.log('finalUrl', finalUrl);
        console.log('queryString', queryString);

        const result = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });
        const jsonResult = await result.json();
        const statusCode = result.status;
        return response.status(statusCode).json(jsonResult);

    })


    return router;
};

