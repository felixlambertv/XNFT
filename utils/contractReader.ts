import fs from "fs";
import path from "path";

export function readContractInfo(
  contractName: string,
  network: string
): string | null {
  const deploymentsPath = path.join(
    __dirname,
    `../ignition/deployments/${network}`
  );
  const deploymentFile = path.join(deploymentsPath, `deployed_addresses.json`);

  try {
    const deploymentData = fs.readFileSync(deploymentFile, "utf-8");
    const deploymentInfo = JSON.parse(deploymentData);
    return deploymentInfo[contractName];
  } catch (error) {
    console.error(
      `Error reading contract ${contractName} deployment on ${network}:`,
      error
    );
    return null;
  }
}
