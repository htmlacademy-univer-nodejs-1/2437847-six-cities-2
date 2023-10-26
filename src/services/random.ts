export const generateRandomNumber = (min: number, max: number, numAfterDigit = 0): number =>
  +(Math.random() * (max - min) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[]): T[] => {
  const randomStartIndex = generateRandomNumber(0, items.length - 1);
  const randomEndIndex = randomStartIndex + generateRandomNumber(0, items.length - randomStartIndex);
  return items.slice(randomStartIndex, randomEndIndex + 1);
};

export const getRandomItem = <T>(items: T[]): T => {
  const randomIndex = generateRandomNumber(0, items.length - 1);
  return items[randomIndex];
};
