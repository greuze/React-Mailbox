const express = require('express');
const path = require('path');
const cors = require('cors');
const emails = require('./emails.json');
const alice = require('./alice@mailtest.json');

const port = process.env.PORT || 9000;
const app = express();
app.use(cors());

app.get('/emails', (request, response) => {
    response.json(emails);
});

app.get('/alice@mailtest.json', (request, response) => {
    response.json(alice);
});

app.post('/auth', (request, response) => {
    response.json(
        {
            "kind": "identitytoolkit#VerifyPasswordResponse",
            "localId": "Tw9EbekT3bbDdNqnC5MRurAtf6W2",
            "email": "alice@mail.test",
            "displayName": "",
            "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwOTg1NzhjNDg4MWRjMDVlYmYxOWExNWJhMjJkOGZkMWFiMzRjOGEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtbWFpbGJveC1jbGllbnQtNGY0NzAiLCJhdWQiOiJyZWFjdC1tYWlsYm94LWNsaWVudC00ZjQ3MCIsImF1dGhfdGltZSI6MTc0NTIyMTYxMiwidXNlcl9pZCI6IlR3OUViZWtUM2JiRGROcW5DNU1SdXJBdGY2VzIiLCJzdWIiOiJUdzlFYmVrVDNiYkRkTnFuQzVNUnVyQXRmNlcyIiwiaWF0IjoxNzQ1MjIxNjEyLCJleHAiOjE3NDUyMjUyMTIsImVtYWlsIjoiZ3JldXplQG1haWwudGVzdCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJncmV1emVAbWFpbC50ZXN0Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.VOI0zumxZOWHXih3457Pp5MKcwbYWFoq8CaNHT4rKQo7G8h8WktH10dyd6v6K7k1c9BhAtpwYuu4mrMa8ZIma9waNVF4PibJiRdpaTIjky05FfvmM40gXF8138tJ0syfTx2yLw9fqjHR4jcgYN_PNAbipgOmIrNVQ4FRjK9fWwSDyxAoGrfbJhJ0CFR7b-F-gMM0bEV0JCtiSV72MKBYxT17eKElQiv_pGsrtPC52ToCzV6qmdIgCNca7NJ9DAchi0lkhHfaGdej_pspCJgTDWkAjugjx_Tn4MBWRWfZiAqSRcg0roMzNDhPl3-AM2skvRQ4GFoqJ6dkJzJBsMUdBQ",
            "registered": true,
            "refreshToken": "AMf-vBzlS3_PhSeaOwf3u7AbzzuTb0ZQbWy5gZCJE2c03NnryzN5WnG4Q7GTah_I0FW9b9LCanlLFpx8NZ66Ao7UfeqsHKrdtDVs3toCmIAhLJzeK1S1pFJpP2yKXuqU49q7vn0aubDbkEb5X4rS9RxP-UYU0MeTZL3hXRoO5VPnzXfSojKQNPTMgP6LftCjLeBDuQ4ELpOWHHql3uy2Rg9NrWY0jNluJcG2RnA8o4IAC7lBtRKS3iY",
            "expiresIn": "3600"
          }
    );
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
