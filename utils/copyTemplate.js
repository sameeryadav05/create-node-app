import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function copyTemplate(type, projectName, targetDir) {
  const tplDir = path.join(__dirname, "../templates", type);

  
  await fs.copy(tplDir, targetDir);


  async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDir(full);
      } else {
        let content = await fs.readFile(full, "utf8");
        content = content.replace(/{{projectName}}/g, projectName);
        await fs.writeFile(full, content, "utf8");
      }
    }
  }

  await processDir(targetDir);


  const gitignorePath = path.join(targetDir, "gitignore");
  if (await fs.pathExists(gitignorePath)) {
    await fs.move(gitignorePath, path.join(targetDir, ".gitignore"));
  }
}
