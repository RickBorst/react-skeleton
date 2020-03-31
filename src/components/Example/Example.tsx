import React from 'react'
import { css } from '@emotion/core'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

import { Moods } from './hooks'

export type Food = { name: string; energy: number; saturation: number }
export type Props = {
  foods: Food[]
  name: string
  charCodes: number[]
  mood: string[]
  energy: number
  saturation: number
  sleep: boolean
  rest: () => void
  wakeUp: () => void
  rename: (name: string) => void
  eat: (food: Food) => void
}
const Example: React.FC<Props> = ({
  foods,
  name,
  charCodes,
  mood,
  energy,
  saturation,
  sleep,
  rest,
  wakeUp,
  rename,
  eat,
}) => (
  <Container maxWidth="sm">
    <Box py={5}>
      <Grid container direction="column" alignItems="center" spacing={1}>
        <Grid item>
          <InputLabel>
            Name:{' '}
            <Input
              onChange={(e) => rename(e.currentTarget.value)}
              value={name}
            />
          </InputLabel>
        </Grid>
        <Grid item>
          <Typography
            css={css`
              margin-top: 1rem;
            `}
          >
            Enough rest and food will keep {name} alive!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h1" component="span">
            {charCodes.map((code) => String.fromCodePoint(code))}
          </Typography>
        </Grid>
        <Grid item>Mood: {mood.join(', ')}</Grid>
        <Grid item>Energy: {energy}</Grid>
        <Grid item>Saturation: {saturation}</Grid>
      </Grid>
    </Box>
    <Grid container direction="row" spacing={1}>
      <Grid xs={12} item>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={sleep ? wakeUp : rest}
          disabled={mood.includes(Moods.dead)}
        >
          {sleep ? 'Wake Up' : 'Rest'}
        </Button>
      </Grid>
      {foods.map((food) => (
        <Grid key={food.name} xs={6} item>
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={() => eat(food)}
            disabled={
              mood.includes(Moods.dead) || mood.includes(Moods.sleeping)
            }
          >
            Eat {food.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  </Container>
)

export default Example
