import { ICliCommand } from './interfaces/ICliComand';
import chalk from 'chalk';
import { City, Facilities, HousingType, UserType } from '../../types/enums';
import { Offer } from '../../types/offer';
import { readFileSync } from 'node:fs';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  public execute(filename: string): void {
    try {
      console.log(this.readOffers(filename.trim()));
    } catch (err) {
      console.log(
        `${chalk.redBright(
          `ERROR! Can't read the file: ${(err as Error).message}`,
        )}`,
      );
    }
  }

  private readOffers(filename: string): Offer[] {
    const data = readFileSync(filename, { encoding: 'utf-8' });
    const offers = data?.split('\n').filter((row) => row.trim() !== '');
    const offersRows = offers?.map((row) => row.split('\t'));
    return offersRows.map(
      ([
        title,
        description,
        publicationDate,
        city,
        preview,
        images,
        premium,
        favorite,
        rating,
        housingType,
        roomCount,
        guestCount,
        facilities,
        authorName,
        authorAvatar,
        authorType,
        authorEmail,
        authorPassword,
        commentsCount,
        latitude,
        longitude,
        cost,
      ]) => ({
        title: title,
        description: description,
        publicationDate: new Date(publicationDate),
        city: city as unknown as City,
        preview: preview,
        images: images.split(','),
        isPremium: premium as unknown as boolean,
        isFavourite: favorite as unknown as boolean,
        rating: parseFloat(rating),
        housingType: housingType as unknown as HousingType,
        roomCount: parseInt(roomCount, 10),
        guestCount: parseInt(guestCount, 10),
        cost: parseInt(cost, 10),
        facilities: facilities
          .split(',')
          .map((x) => x as unknown as Facilities),
        author: {
          name: authorName,
          avatar: authorAvatar,
          type: authorType as unknown as UserType,
          email: authorEmail,
          password: authorPassword,
        },
        commentsCount: parseInt(commentsCount, 10),
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      }),
    );
  }
}
