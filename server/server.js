const express = require('express');
const path = require('path');
const cors = require('cors');
const emails = require('./emails.json');
const accounts = require('./accounts.json');

const port = process.env.PORT || 9000;
const app = express();
app.use(cors());
app.use(express.json());

app.post('/emails', (request, response) => {
    const email = request.body?.email;
    if (email) {
        console.log(`Getting emails for user ${email} from ip ${request.ip}`);
        const filteredEmails = emails.filter(e => {
            if (e.sender === email || e.recipients.includes(email)) {
                const emailTimestamp = new Date(e.timestamp);
                if (isNaN(emailTimestamp)) {
                    console.log(`E-mail ${e.id} for user ${email} has an incorrect timestamp ${e.timestamp}`);
                    return false;
                }
                const diff = emailTimestamp.getTime() - new Date().getTime();
                if (diff < 0) {
                    // E-mail timestamp is in the past
                    return true;
                } else {
                    console.log(`Future e-mail ${e.id} for user ${email} will be sent in ` +
                            `${Math.floor(diff / 60000)} minutes and ` +
                            `${Math.floor((diff % 60000) / 1000)} seconds`
                    );
                    return false;
                }
            } else {
                return false;
            }
        });
        response.json(filteredEmails);
    } else {
        response.status(401).json({
            "error": {
                "code": 401,
                "message": "El e-mail o la contraseña no es válido"
            }
        });
    }
});

app.post('/auth', (request, response) => {
    const { email, password } = request.body;
    const user = accounts.find((account) => account.email === email && account.password === password && account.active !== false);
    if (user) {
        response.status(200).json({
            "email": email,
            "displayName": user.displayName || "",
            "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZha2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.7I6zz2ZIH7DXuPLmMNU9jSKnXhgr49XJFaL1T8_PddQ"
        });
    } else {
        response.status(401).json({
            "error": {
                "code": 401,
                "message": "El e-mail o la contraseña no es válido"
            }
        });
    }
    console.log(`Authenticating user ${email} from ip ${request.ip}`);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
