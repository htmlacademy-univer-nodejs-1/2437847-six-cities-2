import CLIApplication from "./app.js";
import HelpCommand from "./comands/help.js";
import VersionCommand from "./comands/version.js";

const myManager = new CLIApplication();
myManager.registerCommands([new HelpCommand(), new VersionCommand()]);
myManager.processCommand(process.argv);
