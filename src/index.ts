import https = require('https');
import core = require('@actions/core');

const org = core.getInput('org');
const packageType = core.getInput('packageType');
const packageName = core.getInput('packageName');
const githubToken = core.getInput('githubToken');

function fetchGithubData() {
    // https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
    let authHeader = {}
    if (githubToken) {
        authHeader = {
            'Authorization': `Bearer ${githubToken}`,
        }
    }
    const url = `https://api.github.com//orgs/${org}/packages/${packageType}/${packageName}/versions`;
    const options = {
        method: 'GET',
        headers: {
            ...authHeader,
            'User-Agent': 'node.js',
            'Accept': 'application/vnd.github.v3+json'
        }
    };
    fetch(url, options)
        .then(x => x.json())
        .then(x => {
            const latest = x[0].name
            core.setOutput('version', latest);
        })
}

fetchGithubData();
