export const normalise = (value: number, min: number, max: number) =>
  Math.min(Math.max(min, value), max)

export const insertUnique = <EntryType>(entry: EntryType, array: EntryType[]) =>
  array.includes(entry) ? array : (array.push(entry), array)

export const insertUniques = <EntryType>(
  entries: EntryType[],
  array: EntryType[]
) => (entries.forEach((entry) => insertUnique(entry, array)), array)
