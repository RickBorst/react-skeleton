import React from 'react'

import { insertUniques, normalise } from './utils'

export const useBoolean = (initialValue = false) => React.useState(initialValue)

export const useInterval = (callback: () => void, interval = 1000) => {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  React.useEffect(() => {
    const id = setInterval(() => callbackRef.current(), interval)
    return () => clearInterval(id)
  }, [interval])
}

export type MoodRule<MoodValuesT> = (
  values: MoodValuesT,
  mood: string[]
) => string[]
export enum Moods {
  happy = 'happy',
  tired = 'tired',
  ravenous = 'ravenous',
  freaking = 'freaking',
  sleeping = 'sleeping',
  dead = 'dead',
}
export const useMood = <MoodValuesT>(
  moodValues: MoodValuesT,
  rules: MoodRule<MoodValuesT>[]
) =>
  React.useMemo(
    () => rules.reduce<string[]>((acc, entry) => entry(moodValues, acc), []),
    [moodValues, rules]
  )

export const useCharCodes = (
  mood: string[],
  charCodeMap: Record<string, number[]>
) =>
  React.useMemo(
    () =>
      Object.entries(charCodeMap).reduce<number[]>(
        (acc, [key, value]) =>
          mood.includes(key) ? insertUniques(value, acc) : acc,
        []
      ),
    [charCodeMap, mood]
  )

export type Food = {
  energy: number
  saturation: number
}
export const useExampleState = () => {
  const [name, rename] = React.useState('Skelly')
  const [sleep, setSleep] = useBoolean()
  const [energy, setEnergy] = React.useState(100)
  const [saturation, setSaturation] = React.useState(50)

  const moodValues = React.useMemo(() => ({ energy, saturation, sleep }), [
    energy,
    saturation,
    sleep,
  ])
  // prettier-ignore
  const moodRules = React.useMemo<MoodRule<typeof moodValues>[]>(()=>([
    ({ energy, sleep }, mood) => (!sleep && energy < 30 ? (mood.unshift(Moods.tired), mood) : mood),
    ({ saturation }, mood) => (saturation < 20 ? (mood.unshift(Moods.ravenous), mood) : mood),
    ({ sleep}, mood) => ((mood.includes(Moods.tired) || mood.includes(Moods.ravenous)) && !sleep ? (mood.unshift(Moods.freaking), mood) : mood),
    ({ sleep}, mood) => (sleep ? (mood.unshift(Moods.sleeping), mood) : mood),
    ({ energy, saturation }, mood) => !energy || !saturation ? [Moods.dead] : mood,
    (_, mood) => mood.length ? mood : [Moods.happy],
  ]),[])
  const mood = useMood(moodValues, moodRules)
  const charCodes = useCharCodes(mood, {
    [Moods.dead]: [128565],
    [Moods.sleeping]: [128564],
    [Moods.freaking]: [129322],
    [Moods.ravenous]: [127860],
    [Moods.tired]: [128164],
    [Moods.happy]: [128513],
  })

  React.useEffect(() => {
    if (mood.includes(Moods.dead)) {
      return
    }
    setSleep((curr) =>
      mood.includes(Moods.ravenous) || energy === 100 ? false : curr
    )
  }, [setSleep, mood, energy])
  React.useEffect(() => {
    if (mood.includes(Moods.dead)) {
      setEnergy(0)
      setSaturation(0)
    }
  }, [mood])

  const rest = React.useCallback(() => setSleep(true), [setSleep])
  const wakeUp = React.useCallback(() => setSleep(false), [setSleep])
  const eat = React.useCallback((food: Food) => {
    setEnergy((curr) => normalise(curr + food.energy, 0, 100))
    setSaturation((curr) => normalise(curr + food.saturation, 0, 100))
  }, [])
  const onTick = React.useCallback(() => {
    setEnergy((curr) => normalise(sleep ? curr + 5 : curr - 2, 0, 100))
    setSaturation((curr) => normalise(curr - 3, 0, 100))
  }, [sleep])

  useInterval(onTick, 1000)

  const values = React.useMemo(
    () => ({
      name,
      charCodes,
      mood,
      energy,
      saturation,
      sleep,
    }),
    [name, charCodes, mood, energy, saturation, sleep]
  )
  const methods = React.useMemo(() => ({ rename, rest, wakeUp, eat }), [
    rest,
    eat,
    wakeUp,
  ])

  return [values, methods] as const
}
