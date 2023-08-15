#!/usr/bin/env node

import {Command} from 'commander';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';

const program = new Command();

console.log(figlet.textSync('Cli2'));

program
	.version('0.0.2')
	.name('cli2')
	.description('An example CLI for managing a directory')
	.option('-l, --ls  [value]', 'List directory contents')
	.option('-m, --mkdir <value>', 'Create a directory')
	.option('-t, --touch <value>', 'Create a file')
	.parse(process.argv);

const options = program.opts();

async function listDirContents(filepath: string) {
	try {
	  const files = await fs.promises.readdir(filepath);
	  const detailedFilesPromises = files.map(async (file: string) => {
		let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
		const { size, birthtime } = fileDetails;
		return { filename: file, "size(KB)": size, created_at: birthtime };
	  });
	  const detailedFiles = await Promise.all(detailedFilesPromises);
	  console.table(detailedFiles);
	} catch (error) {
	  console.error("Error occurred while reading the directory!", error);
	}
  }

// check if the option has been used the user
if (options.ls) {
	const filepath = typeof options.ls === "string" ? options.ls : __dirname;
	listDirContents(filepath);
  }
