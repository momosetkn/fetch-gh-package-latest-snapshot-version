const https = require('https');
const core = require('@actions/core');

const org = core.getInput('org');
const packageType = core.getInput('packageType');
const packageName = core.getInput('packageName');
const githubToken = core.getInput('githubToken');

function fetchGithubData() {
    // https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
    let authHeader = ''
    if (githubToken) {
        authHeader = {
            'Authorization': `Bearer ${githubToken}`,
        }
    }
    const options = {
        hostname: 'api.github.com',
        path: `/orgs/${org}/packages/${packageType}/${packageName}/versions`,
        method: 'GET',
        headers: {
            ...authHeader,
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
                core.setOutput('version', latest);
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
