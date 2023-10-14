import CLIApplication from "./app.js";
import HelpCommand from "./comands/help.js";
import VersionCommand from "./comands/version.js";
import ImportCommand from "./comands/import.js";

const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
]);
myManager.processCommand(process.argv);
