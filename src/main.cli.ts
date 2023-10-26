#!/usr/bin/env node
import CLIApplication from './cli/app.js';
import HelpCommand from './cli/comands/help.js';
import VersionCommand from './cli/comands/version.js';
import ImportCommand from './cli/comands/import.js';
import GenerateCommand from './cli/comands/generate.js';

const myManager = new CLIApplication();
myManager.registerCommands([new HelpCommand(), new VersionCommand(), new ImportCommand(), new GenerateCommand()]);
myManager.processCommand(process.argv);
