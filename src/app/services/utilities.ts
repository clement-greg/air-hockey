
export function getSecondsBetweenDates(date1: Date, date2: Date): number {
    let diffInMilliseconds = date2.getTime() - date1.getTime();
    return Math.floor(diffInMilliseconds / 1000);
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }