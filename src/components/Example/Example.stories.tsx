import React from 'react'
import { storiesOf } from '@storybook/react'
import { text, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Example, { Props } from './Example'

const rest = action('rest')
const wakeUp = action('wake up')
const rename = action('rename')
const eat = action('eat')

storiesOf('Example', module).add('default', () => {
  const props: Props = {
    name: text('name', 'Skelly'),
    mood: [select('mood', { happy: 'happy', freaking: 'freaking' }, 'happy')],
    charCodes: [
      select('charCodes', { happy: 128513, freaking: 129322 }, 128513),
    ],
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
  return <Example {...props} />
})
