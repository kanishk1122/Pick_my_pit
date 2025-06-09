const fs = require("fs");
const path = require("path");

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    // Try to resolve the package
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Read package.json
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Get dependencies
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// Combine dependencies
const allDependencies = { ...dependencies, ...devDependencies };

console.log("Checking for missing dependencies...");

// Check each dependency
const missingDependencies = [];
for (const packageName in allDependencies) {
  if (!isPackageInstalled(packageName)) {
    missingDependencies.push(packageName);
  }
}

if (missingDependencies.length === 0) {
  console.log("All dependencies are installed!");
} else {
  console.log("Missing dependencies:");
  missingDependencies.forEach((dep) => {
    console.log(`- ${dep}`);
  });
  console.log("\nRun the following command to install missing dependencies:");
  console.log(`npm install ${missingDependencies.join(" ")}`);
}
