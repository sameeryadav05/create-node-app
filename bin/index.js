#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { execa } from "execa";   // ✔ FIXED
import copyTemplate from "../utils/copyTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("create-node")
  .version("1.0.0")
  .argument("<project-name>", "name of node.js project")
  .option("--ts", "generate TypeScript project")
  .option("--js", "generate JavaScript project (default)")
  .option("--install", "run npm install in generated project")
  .option("--git", "initialize git in generated project")
  .description("Create a Node.js Project using (JS or TS)")
  .action(async (projectName, opts) => {
    const spinner = ora();

    try {
      const targetDir = path.join(process.cwd(), projectName);
      const templateType = opts.ts ? "ts" : "js";

      spinner.start(
        `Creating ${projectName} ${
          templateType == "js" ? "(javascript)" : "(typescript)"
        }`
      );

      if (fs.existsSync(targetDir)) {
        spinner.fail(`${projectName} already exists.`);
        process.exit(1);
      }

      await copyTemplate(templateType, projectName, targetDir);
      spinner.succeed("Project Successfully Created");

      if (opts.git) {
        spinner.start("Initializing git...");
        await execa("git", ["init"], { cwd: targetDir });
        spinner.succeed("Git initialized.");
      }

      if (opts.install) {
        spinner.start("Installing dependencies...");
        await execa("npm", ["install"], {
          cwd: targetDir,
          stdio: "inherit",
        });
        spinner.succeed("Dependencies installed.");
      }

      console.log(chalk.green("\nNext steps:"));
      console.log(chalk.cyan(`cd ${projectName}`));
      if (!opts.install) console.log(chalk.cyan("npm install"));
      console.log(chalk.cyan("npm run dev"));
    } catch (error) {
      spinner.fail(String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);
