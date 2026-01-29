
const http = require('http');

const createPasteWithTTL = (ttl) => {
    console.log(`Creating paste with TTL: ${ttl}`);
    const data = JSON.stringify({
        content: `Test content for TTL ${ttl}`,
        ttl_seconds: ttl
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

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('Create Body:', body);
            if (res.statusCode === 201) {
                const responseData = JSON.parse(body);
                setTimeout(() => checkUrl(responseData.url), 1000); // Check after 1 second
            }
        });
    });

    req.on('error', (error) => {
        console.error('Create Error:', error);
    });

    req.write(data);
    req.end();
};

const checkUrl = (url) => {
    console.log(`Checking URL: ${url}`);

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
            if (res.statusCode === 200) {
                console.log('Success: Page found!');
            } else {
                console.log('Error: Page returned status ' + res.statusCode);
            }
        });

        req.on('error', (e) => {
            console.error('Get Error:', e);
        });
        req.end();

    } catch (e) {
        console.error("Invalid URL returned:", url);
    }
}

// Test with a reasonable TTL
createPasteWithTTL(60);
