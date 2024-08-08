import { registerFilter } from 'amis';

registerFilter('mapFilterNull', (array: Array<{ [key: string]: string }>) => {
  if (array.length > 0) {
    return array
      .map((item) => {
        for (const key in item) {
          if (item[key] === undefined || item[key] === null) {
            delete item[key];
          }
        }
        if (Object.getOwnPropertyNames(item)) {
          return item;
        }
      })
      .filter((v) => v);
  }
  return [];
});

registerFilter('flat', (array: Array<{ [key: string]: string }>, deep: number) => {
  if (array.length > 0) {
    return array.flat(deep);
  }
  return [];
});
