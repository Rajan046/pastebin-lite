
const http = require('http');

const createExpiredPaste = () => {
    // Create a paste with 1 second TTL
    const data = JSON.stringify({
        content: "Content that will expire",
        ttl_seconds: 1
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/pastes',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Create Status: ${res.statusCode}`);
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 201) {
                const url = JSON.parse(body).url;
                console.log(`Created: ${url}. Waiting 2 seconds for expiration...`);
                setTimeout(() => checkUrl(url), 2000);
            }
        });
    });
    req.write(data);
    req.end();
};

const checkUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`Get Status: ${res.statusCode}`);
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (body.includes('Paste expired')) {
                    console.log('Success: "Paste expired" message found in response.');
                } else if (res.statusCode === 404) {
                    console.log('Failure: Still returning 404 Not Found.');
                } else {
                    console.log('Response content snippet:', body.substring(0, 100));
                }
            });
        });
        req.end();

    } catch (e) { console.error(e); }
}

createExpiredPaste();
