import React from 'react'
import { render, act } from '@testing-library/react'

import { getLastMockParams } from '../../../utils/test/mock'

import ExampleContainer from './ExampleContainer'
import Example from './Example'

const MockExample = jest.fn(() => <div>Mock</div>)
jest.mock('./Example', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('ExampleContainer', () => {
  beforeAll(() => (Example as jest.Mock).mockImplementation(MockExample))
  it('should pass state correctly', () => {
    render(<ExampleContainer />)

    let props = getLastMockParams(MockExample)
    expect(props).toEqual(
      expect.objectContaining({
        name: 'Skelly',
        mood: ['happy'],
        charCodes: [128513],
        energy: 100,
        saturation: 50,
        sleep: false,
      })
    )
    expect(props.foods).toEqual(
      expect.arrayContaining([
        { name: 'Celery', energy: -5, saturation: 10 },
        { name: 'Candy Bar', energy: 15, saturation: 5 },
        { name: 'Burger', energy: 20, saturation: 20 },
        { name: 'Spare Ribs', energy: 30, saturation: 40 },
      ])
    )

    act(() => props.eat(props.foods[0]))

    props = getLastMockParams(MockExample)

    expect(props.energy === 95)

    act(() => props.rename('John'))

    expect(props.name === 'John')
  })
})
