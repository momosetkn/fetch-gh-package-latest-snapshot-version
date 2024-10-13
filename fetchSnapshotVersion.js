const https = require('https');

const [scriptPath, org, packageType, packageName, githubToken] = process.argv

function fetchGithubData() {
    // https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
    const options = {
        hostname: 'api.github.com',
        path: `/orgs/${org}/packages/${packageType}/${packageName}/versions`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'User-Agent': 'node.js',
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                const latest = jsonData[0].name
                console.log(latest);
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
}

fetchGithubData();
