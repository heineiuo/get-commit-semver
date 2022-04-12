const semver = require("semver");

for (const ver of [
  "v1.1.",
  "2.2.2",
  "3.3.3.33",
  "v4.4.4-alpha.444",
  "v5.5.5-beta.555",
  "v6.6.6-build666",
  "v7",
  "v8.8.8-build.8888",
  "v9.9.9+9999",
]) {
  console.log(ver);
  console.log(semver.valid(ver));
  console.log(semver.parse(ver));
}
