import { ICliCommand } from './interfaces/ICliComand.js';
import chalk from 'chalk';
import { FileReader } from '../../core/file/fileService.js';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    try {
      this.readOffers(filename.trim()).then((count: number) => {
        console.log(`File ${chalk.blueBright(filename)} was successfully read. ${count} offers were imported`);
      });
    } catch (err) {
      console.log(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }

  private async readOffers(filename: string): Promise<number> {
    const fileReader = new FileReader(filename.trim());
    let count = 0;

    for await (const offer of fileReader.read()) {
      console.log(offer);
      count++;
    }

    return count;
  }
}
