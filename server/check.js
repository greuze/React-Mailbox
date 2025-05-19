const emails = require('./emails.json');
const accounts = require('./accounts.json');

const accountsWithEmails = new Set();

function checkEmails() {
    const ids = [];
    let i = 1;
    let errors = 0;
    let warnings = 0;

    console.log("Checking emails...");

    emails.forEach(email => {
        // Check if the email has a valid id
        if (!email.id) {
            console.log(`ERROR: E-mail ${i} does not have id`);
            errors++;
        } else if (ids.includes(email.id)) {
            console.log(`ERROR: E-mail id "${email.id}" (${i}) is duplicated`);
            errors++;
        } else {
            ids.push(email.id);
        }

        // Check if the email has a valid sender
        if (!email.sender || !email.recipients || email.recipients.length === 0) {
            console.log(`ERROR: E-mail "${email.id}" (${i}) has an invalid sender or recipients`);
            errors++;
        } else {
            // Add all used e-mails
            accountsWithEmails.add(email.sender);
            email.recipients.forEach(recipient => {
                accountsWithEmails.add(recipient);
            });
        }

        // Check if the email has a valid timestamp
        const emailTimestamp = new Date(email.timestamp);
        if (isNaN(emailTimestamp)) {
            console.log(`ERROR: E-mail "${email.id}" (${i}) has an incorrect timestamp "${email.timestamp}"`);
            errors++;
        } else {
            // Check if the email is in the past
            const diff = emailTimestamp.getTime() - new Date().getTime();
            if (diff > 0) {
                console.log(`WARNING: E-mail ${email.id} (${i}) will be sent in ` +
                    `${Math.floor(diff / 60000)} minutes and ` +
                    `${Math.floor((diff % 60000) / 1000)} seconds`
                );
                warnings++;
            }
        }

        // Check if all starred emails are present
        if (email.starred && email.starred.length > 0) {
            email.starred.forEach(starredEmail => {
                if (starredEmail !== email.sender && !email.recipients.includes(starredEmail)) {
                    console.log(`ERROR: E-mail "${email.id}" (${i}) has a starred email "${starredEmail}" that is not sender or recipient`);
                    errors++;
                }
            });
        }

        // Check if all trashed emails are present
        if (email.trashed && email.trashed.length > 0) {
            email.trashed.forEach(trashedEmail => {
                if (trashedEmail !== email.sender && !email.recipients.includes(trashedEmail)) {
                    console.log(`ERROR: E-mail "${email.id}" (${i}) has a trashed email "${trashedEmail}" that is not sender or recipient`);
                    errors++;
                }
            });
        }

        // Check if the email has a valid subject
        if (!email.subject) {
            console.log(`ERROR: E-mail "${email.id}" (${i}) does not have a subject`);
            errors++;
        }

        // Check if the email has a valid body
        if (!email.emailContent) {
            console.log(`ERROR: E-mail "${email.id}" (${i}) does not have content`);
            errors++;
        }

        i++;
    });

    console.log(`Found ${errors} errors and ${warnings} warnings in emails\n`);
}

function checkAccounts() {
    let i = 1;
    let errors = 0;
    let warnings = 0;

    console.log("Checking accounts...");

    accounts.forEach(account => {
        // Check if the account has a valid email
        if (!account.email) {
            console.log(`ERROR: Account ${i} does not have email`);
            errors++;
        }

        // Check if the account has a valid password
        if (!account.password) {
            console.log(`ERROR: Account "${account.email}" (${i}) does not have password`);
            errors++;
        }

        // Check if account has any emails
        if (!accountsWithEmails.has(account.email)) {
            console.log(`WARNING: Account "${account.email}" (${i}) is not present in any e-mail`);
            warnings++;
        }

        i++;
    });

    accountsWithEmails.forEach(email => {
        // Check if the email is present in accounts
        if (!accounts.some(account => account.email === email)) {
            console.log(`WARNING: E-mail "${email}" does not belong to any account`);
            warnings++;
        }
    });

    console.log(`Found ${errors} errors and ${warnings} warnings in accounts`);
}

checkEmails();
checkAccounts();
