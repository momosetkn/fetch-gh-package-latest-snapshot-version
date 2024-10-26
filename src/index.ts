import { getInput, setOutput } from '@actions/core'
import fetch from 'node-fetch'

async function getLatestVersion({
  githubToken,
  versionPattern,
  org,
  packageType,
  packageName,
}: {
  githubToken: string | undefined
  versionPattern: string | undefined
  org: string
  packageType: string
  packageName: string
}): Promise<string | undefined> {
  // https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
  let authHeader = {}
  if (githubToken) {
    authHeader = {
      Authorization: `Bearer ${githubToken}`,
    }
  }
  const url = `https://api.github.com/orgs/${org}/packages/${packageType}/${packageName}/versions`
  const options = {
    headers: {
      ...authHeader,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }
  const versionRegex = versionPattern && new RegExp(versionPattern)
  return fetch(url, options)
    .then((response) =>
      response.json().then((data) => ({
        ok: response.ok,
        status: response.status,
        data: data as { name: string }[],
      })),
    )
    .then(({ ok, status, data }) => {
      if (!ok) {
        throw new Error(
          `HTTP error! status: ${status} body: ${JSON.stringify(data)}`,
        )
      }
      if (versionRegex) {
        return data
          .map((x) => x.name)
          .find((name) => name && versionRegex.test(name))
      } else {
        return data[0].name
      }
    })
}

function fetchGithubData() {
  const org = getInput('org')
  const packageType = getInput('packageType')
  const packageName = getInput('packageName')
  const githubToken = getInput('githubToken')
  const versionPattern = getInput('versionPattern')
  const version = getLatestVersion({
    githubToken,
    org,
    packageType,
    packageName,
    versionPattern,
  })
  version
    .then((v) => {
      console.log(`version: ${v}`)
      setOutput('version', v)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

fetchGithubData()
