import { ICliCommand } from './interfaces/сli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements ICliCommand {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    const cyan = chalk.cyanBright;
    const blue = chalk.blueBright;
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js ${cyan('--<command>')} ${blue('[--arguments]')}
        ${chalk.greenBright('Команды')}
              ${cyan('--version:')}          # выводит номер версии
              ${cyan('--help:')}             # печатает этот текст
              ${cyan('--import')} ${blue('<path>')}:    # импортирует данные из TSV
        `);
  }
}
