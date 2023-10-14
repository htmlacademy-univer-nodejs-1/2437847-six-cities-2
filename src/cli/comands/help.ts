import { ICliCommand } from './interfaces/ICliComand';
import chalk from 'chalk';

export default class HelpCommand implements ICliCommand {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js ${chalk.cyanBright('--<command>')} ${chalk.blueBright(
              '[--arguments]',
            )}
        ${chalk.greenBright('Команды')}
              ${chalk.cyanBright(
                '--version:',
              )}                  # выводит номер версии
              ${chalk.cyanBright(
                '--help:',
              )}                     # печатает этот текст
              ${chalk.cyanBright('--import')} ${chalk.blueBright(
                '<path>',
              )}:            # импортирует данные из TSV
        `);
  }
}
