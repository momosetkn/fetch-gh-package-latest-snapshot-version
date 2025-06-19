import { getInput, setOutput } from "@actions/core";
import fetch, { type Response as NodeFetchResponse } from "node-fetch";

function main() {
	const org = getInput("org");
	const packageType = getInput("packageType");
	const packageName = getInput("packageName");
	const githubToken = getInput("githubToken");
	const versionPattern = getInput("versionPattern");
	const version = getLatestVersion({
		githubToken,
		org,
		packageType,
		packageName,
		versionPattern,
	});
	version
		.then((v) => {
			if (!v) {
				throw new Error(
					`Could not find version for package ${packageName} in org ${org}`,
				);
			}
			console.log(`version: ${v}`);
			setOutput("version", v);
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}

async function getLatestVersion({
	githubToken,
	versionPattern,
	org,
	packageType,
	packageName,
}: {
	githubToken: string | undefined;
	versionPattern: string | undefined;
	org: string;
	packageType: string;
	packageName: string;
}): Promise<string | undefined> {
	const versionRegex = versionPattern && new RegExp(versionPattern);
	return getVersions({
		githubToken,
		org,
		packageType,
		packageName,
	})
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
				);
			}
			if (versionRegex) {
				return data.map((x) => x.name).find((name) => versionRegex.test(name));
			}
			return data[0].name;
		});
}

async function getVersions({
	githubToken,
	org,
	packageType,
	packageName,
}: {
	githubToken: string | undefined;
	org: string;
	packageType: string;
	packageName: string;
}): Promise<NodeFetchResponse> {
	// https://docs.github.com/en/rest/packages/packages?apiVersion=2022-11-28#list-package-versions-for-a-package-owned-by-an-organization
	let authHeader = {};
	if (githubToken) {
		authHeader = {
			Authorization: `Bearer ${githubToken}`,
		};
	}
	const url = `https://api.github.com/orgs/${org}/packages/${packageType}/${packageName}/versions`;
	console.log(`fetching ${url}`);
	return fetch(url, {
		headers: {
			...authHeader,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
}

main();
