const router = require('express').Router();
require('dotenv').config();

const apiKey = process.env.COINCAP_API_KEY;
const baseUrl = `https://rest.coincap.io/v3`;


module.exports = () => {

    router.get('/', (request, response) => {
        return response.status(404).send({
            message: 'No endpoint specified'
        })
    });

    router.get(['/assets', '/assets/:id', '/assets/:id/history'], async (request, response) => {
        const getParams = {
            ...request.query,
            apiKey
        };
        const path = request.path;
        const queryString = new URLSearchParams(getParams).toString();
        const finalUrl = `${baseUrl}${path}?${queryString}`;
        console.log(finalUrl);
        const result = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jsonResult = await result.json();
        const statusCode = result.status;
        return response.status(statusCode).json(jsonResult);

    })


    return router;
};

