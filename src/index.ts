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
    const url = `https://api.github.com/orgs/${org}/packages/${packageType}/${packageName}/versions`;
    const options = {
        method: 'GET',
        headers: {
            ...authHeader,
            'Accept': 'application/vnd.github.v3+json'
        }
    };
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(x => {
            console.log(JSON.stringify(x))
            const latest = x.data[0].name
            console.log(`version: ${latest}`)
            core.setOutput('version', latest);
        })
        .catch(error => console.error(error));
}

fetchGithubData();
