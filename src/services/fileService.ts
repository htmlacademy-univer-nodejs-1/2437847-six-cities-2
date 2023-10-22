import { createReadStream } from 'node:fs';
import * as os from 'node:os';
import { createWriteStream } from 'node:fs';
import { ReadStream } from 'node:fs';
import { WriteStream } from 'node:fs';

export class FileReader {
  private readonly stream: ReadStream;

  constructor(public filename: string) {
    this.stream = createReadStream(this.filename, {
      highWaterMark: 2 ** 16,
      encoding: 'utf-8',
    });
  }

  public async *read(): AsyncGenerator<string> {
    let data = '';
    let nextLine = -1;

    for await (const chunk of this.stream) {
      data += chunk.toString();

      while ((nextLine = data.indexOf('\n')) >= 0) {
        const completeRow = data.slice(0, nextLine + 1);
        data = data.slice(++nextLine);
        yield completeRow;
      }
    }
  }
}

export class FileWriter {
  private readonly stream: WriteStream;

  constructor(public filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 2 ** 16,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (this.stream.write(`${row}${os.EOL}`)) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
  }
}
