import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import Example, { Props } from './Example'

const rest = jest.fn()
const wakeUp = jest.fn()
const rename = jest.fn()
const eat = jest.fn()
const defaultProps: Props = {
  name: 'Skelly',
  mood: ['happy'],
  charCodes: [128513],
  energy: 100,
  saturation: 50,
  sleep: false,
  foods: [
    { name: 'Peanut', energy: 10, saturation: 10 },
    { name: 'Poison', energy: -10, saturation: -10 },
  ],
  rest,
  wakeUp,
  rename,
  eat,
}

describe('Example', () => {
  afterEach(() => {
    rest.mockReset()
    wakeUp.mockReset()
    rename.mockReset()
    eat.mockReset()
  })

  it('should render correctly', () => {
    const { queryByText } = render(<Example {...defaultProps} />)
    expect(queryByText('Rest')).toBeInTheDocument()
    expect(queryByText('Eat Peanut')).toBeInTheDocument()
    expect(queryByText('Eat Poison')).toBeInTheDocument()
  })

  it('should handle events correctly', () => {
    const { getByText, getByDisplayValue, rerender } = render(
      <Example {...defaultProps} />
    )

    fireEvent.click(getByText('Rest'))
    expect(rest).toHaveBeenCalled()

    fireEvent.click(getByText('Eat Poison'))
    expect(eat).toHaveBeenCalledWith(defaultProps.foods[1])

    rerender(<Example {...defaultProps} sleep={true} />)
    fireEvent.click(getByText('Wake Up'))
    expect(wakeUp).toHaveBeenCalled()

    fireEvent.change(getByDisplayValue('Skelly'), { target: { value: 'John' } })
    expect(rename).toHaveBeenCalledWith('John')
  })
})
