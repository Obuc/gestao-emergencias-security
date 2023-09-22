export const arraysAreEqual = <T>(arr1: T[], arr2: T[]): boolean =>
  arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
