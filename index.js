// index.js
const express = require('express');
const bodyParser = require('body-parser')
const { exec } = require('child_process');
const retry = require('retry')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
    res.send("<h1>Hello world!</h1>")
})

// Form to submit domain name
app.get('/generate-certificate', (req, res) => {
    const form = `
        <form action="/generate-certificate" method="POST">
            <label for="domain">Domain Name:</label>
            <input type="text" id="domain" name="domain" required>
            <button type="submit">Generate Certificate</button>
        </form>
    `;
    res.send(form); // Send the HTML form
});

const generateCertificate = async (domain) => {
    return new Promise((resolve, reject) => {
        const ssl_script = exec(`sh updated_ssl.sh ${domain}`);

        ssl_script.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ssl_script.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        ssl_script.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error('Error generating certificate'));
            }
        });
    });
};

const generateCertificateWithRetry = async (domain) => {
    const operation = retry.operation({
        retries: 5, // Total number of retries (including the initial attempt)
        factor: 2, // Exponential backoff factor
        minTimeout: 2 * 1000, // Initial timeout (2 hours)
        maxTimeout: 2 * 1000, // Maximum timeout (2 hours)
    });

    return new Promise((resolve, reject) => {
        operation.attempt(async (currentAttempt) => {
            try {
                await generateCertificate(domain);
                resolve();
            } catch (error) {
                if (operation.retry(error)) {
                    console.error(`Attempt ${currentAttempt} failed, retrying...`);
                    return;
                }
                reject(operation.mainError());
            }
        });
    });
};

app.post('/generate-certificate', async (req, res) => {
    const { domain } = req.body;

    try {
        await generateCertificateWithRetry(domain);
        res.status(200).send('Certificate generation successful');
    } catch (error) {
        console.error(`exec error: ${error}`);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*
curl -H 'Content-Type: application/json' -d '{ "domain":"example.com" }' -X POST http://localhost:3000/generate-certificate
*/