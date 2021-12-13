import { danger, fail, schedule } from "danger"
import { isEqual, includes } from "lodash"
import eslint from "@fido-id/danger-plugin-eslint"
import commitlint from "danger-plugin-conventional-commitlint"
import configConventional from "@commitlint/config-conventional"

schedule(async () => {
  // checks for eslint errors
  eslint()

  const hasChangelogModified = danger.git.modified_files.includes(
    "docs/CHANGELOG.md",
  )

  if (hasChangelogModified) {
    fail("Please do not edit the changelog! It is automatically generated.")
  }

  await commitlint(configConventional.rules, { severity: "warn" })

  const packageDiff = await danger.git.JSONDiffForFile("package.json")

  const haveDependenciesChanged =
    (packageDiff.dependencies &&
      !isEqual(
        packageDiff.dependencies.before,
        packageDiff.dependencies.after,
      )) ||
    (packageDiff.devDependencies &&
      !isEqual(
        packageDiff.devDependencies.before,
        packageDiff.devDependencies.after,
      ))
  const hasLockfileChanged = includes(danger.git.modified_files, "yarn.lock")
  if (haveDependenciesChanged && !hasLockfileChanged) {
    fail(
      "There are changes in the package.json dependency list with no corresponding changes in the yarn.lock file",
    )
  }
})
