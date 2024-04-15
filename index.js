// index.js
const express = require('express');
const bodyParser = require('body-parser')
const { exec } = require('child_process');

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

app.post('/generate-certificate', async (req, res) => {
    const { domain } = req.body;

    try {
        const ssl_script = await exec(`sh updated_ssl.sh ${domain}`);

        ssl_script.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ssl_script.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ssl_script.on('exit', (code) => {
            if (code === 0) {
                res.status(200).send('Certificate generation successful');
            } else {
                res.status(500).send('Error generating certificate');
            }
        });
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