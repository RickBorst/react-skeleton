import { insertUnique, insertUniques, normalise } from './utils'

describe('normalise', () => {
  it('should normalise numbers within the specified range', () => {
    const cases: Array<{
      input: Parameters<typeof normalise>
      output: number
    }> = [
      { input: [5, 0, 10], output: 5 },
      { input: [-2, 0, 10], output: 0 },
      { input: [12, 0, 10], output: 10 },
    ]

    cases.forEach(({ input, output }) =>
      expect(normalise(...input)).toBe(output)
    )
  })
})

describe('insertUnique', () => {
  it('should only insert entries not already present', () => {
    const cases: Array<{
      input: Parameters<typeof insertUnique>
      output: unknown[]
    }> = [
      { input: [1, [2, 3]], output: [2, 3, 1] },
      { input: [1, [1, 2]], output: [1, 2] },
      { input: ['c', ['a', 'b']], output: ['a', 'b', 'c'] },
      { input: ['c', ['b', 'c']], output: ['b', 'c'] },
    ]
    cases.forEach(({ input, output }) =>
      expect(insertUnique(...input)).toEqual(output)
    )
  })
})

describe('insertUniques', () => {
  it('should only insert arrays of entries not already present', () => {
    const cases: Array<{
      input: Parameters<typeof insertUniques>
      output: unknown[]
    }> = [
      {
        input: [
          [1, 4],
          [2, 3],
        ],
        output: [2, 3, 1, 4],
      },
      {
        input: [
          [1, 2],
          [1, 2],
        ],
        output: [1, 2],
      },
      {
        input: [
          ['c', 'd'],
          ['a', 'b'],
        ],
        output: ['a', 'b', 'c', 'd'],
      },
      {
        input: [
          ['b', 'c'],
          ['b', 'c'],
        ],
        output: ['b', 'c'],
      },
    ]
    cases.forEach(({ input, output }) =>
      expect(insertUniques(...input)).toEqual(output)
    )
  })
})
