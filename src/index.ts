import { getInput, setOutput } from '@actions/core';
import fetch from 'node-fetch';

function fetchGithubData() {
    const org = getInput('org');
    const packageType = getInput('packageType');
    const packageName = getInput('packageName');
    const githubToken = getInput('githubToken');

    // https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
    let authHeader = {}
    if (githubToken) {
        authHeader = {
            'Authorization': `Bearer ${githubToken}`,
        }
    }
    const url = `https://api.github.com/orgs/${org}/packages/${packageType}/${packageName}/versions`;
    const options = {
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    };
    fetch(url, options)
        .then(response =>
            response.json().then(data =>
                [response.ok, response.status, data])
        )
        .then(([ok, status, data]) => {
            if (!ok) {
                throw new Error(`HTTP error! status: ${status} body: ${JSON.stringify(data)}`);
            }
            const latest = data[0].name
            console.log(`version: ${latest}`)
            setOutput('version', latest)
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

fetchGithubData();
