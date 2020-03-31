import React from 'react'

import { useExampleState } from './hooks'
import Example, { Props as ExampleProps } from './Example'

const ExampleContainer = () => {
  const [values, methods] = useExampleState()
  const foods: ExampleProps['foods'] = [
    { name: 'Celery', energy: -5, saturation: 10 },
    { name: 'Candy Bar', energy: 15, saturation: 5 },
    { name: 'Burger', energy: 20, saturation: 20 },
    { name: 'Spare Ribs', energy: 30, saturation: 40 },
  ]
  return <Example {...values} {...methods} foods={foods} />
}

export default ExampleContainer
