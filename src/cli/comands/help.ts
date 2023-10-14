import { ICliCommand } from "./interfaces/ICliComand";

export default class HelpCommand implements ICliCommand {
  public readonly name = "--help";

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:       # выводит номер версии
            --help:          # печатает этот текст
            --import <path>: # импортирует данные из TSV
        `);
  }
}
