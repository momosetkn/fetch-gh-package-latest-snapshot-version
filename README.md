# fetch-gh-package-latest-snapshot-version

This github-actions is get the latest snapshot version of GitHub packages

## Setup example

example of [liquibase-core snapshot](https://github.com/liquibase/liquibase/packages/1783578)

```yaml
      - name: Fetch latest SNAPSHOT version from GitHub Packages
        id: liquibase-core-latest-snapshot-version
        uses: momosetkn/fetch-gh-package-latest-snapshot-version@main
        with:
          org: liquibase
          packageType: maven
          packageName: org.liquibase.liquibase-core
          githubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Test with latest liquibase SNAPSHOT version
        run: |
          ./gradlew test -PliquibaseVersion=${{ steps.liquibase-core-latest-snapshot-version.outputs.version }}
```
