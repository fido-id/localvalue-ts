import { danger, fail, schedule } from "danger"
import { isEqual, includes } from "lodash";

schedule(async () => {
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
