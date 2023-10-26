import { ICliCommand } from './interfaces/ICliComand.js';
import { MockData } from '../../types/mockData.js';
import { FileWriter } from '../../services/fileService.js';
import { generateOffer } from '../../services/offers.js';
import got from 'got';

export default class GenerateCommand implements ICliCommand {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(count: string, filepath: string, url: string): Promise<void> {
    const offerCount = Number.parseInt(count, 10);
    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.log(`Can't fetch data from ${url}`);
      return;
    }

    const fileWriter = new FileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await fileWriter.write(generateOffer(this.initialData));
    }

    console.log(`File ${filepath} was successfully created`);
  }
}
