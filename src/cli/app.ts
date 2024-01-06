import { ICliCommand } from './commands/interfaces/сli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[];
};

export default class CLIApplication {
  private commands: { [propertyName: string]: ICliCommand } = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }

      return acc;
    }, parsedCommand);
  }

  public getCommand(commandName: string): ICliCommand {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }

  public registerCommands(commandList: ICliCommand[]): void {
    commandList.reduce((acc, command) => {
      const cliCommand = command;
      acc[cliCommand.name] = cliCommand;
      return acc;
    }, this.commands);
  }
}
