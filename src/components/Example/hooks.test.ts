import { renderHook, act } from '@testing-library/react-hooks'

import {
  useBoolean,
  useCharCodes,
  useExampleState,
  useInterval,
  useMood,
} from './hooks'

describe('useBoolean', () => {
  it('should initialise being false by default', () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current[0]).toBe(false)
  })

  it('should accept an initial value', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current[0]).toBe(true)
  })

  it('should be able to change the value', () => {
    const { result } = renderHook(() => useBoolean())
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
  })
})

describe('useInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should call the callback function with the specified interval', () => {
    const callback = jest.fn()
    renderHook(() => useInterval(callback, 10))
    expect(callback).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(5)
    expect(callback).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(5)
    expect(callback).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(40)
    expect(callback).toHaveBeenCalledTimes(5)
  })

  it('should support any interval number', async () => {
    const callback = jest.fn()
    renderHook(() => useInterval(callback, 25))
    expect(callback).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(25)
    expect(callback).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(25)
    expect(callback).toHaveBeenCalledTimes(2)

    callback.mockReset()
    renderHook(() => useInterval(callback, 1))
    expect(callback).toHaveBeenCalledTimes(0)
    jest.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('useMood', () => {
  it('should return moods based on a list of rules', () => {
    const moodValues = { angry: 20, excited: 30 }
    // prettier-ignore
    const moodRules: Array<((values: Record<string,number>, mood: string[]) => string[])> = [
      (values, mood) => (values.angry > 25 ? (mood.push('angry'), mood) : mood),
      (values, mood) => (values.excited > 25 ? (mood.push('excited'), mood) : mood)
    ]
    const initialProps = [moodValues, moodRules] as const
    const { result, rerender } = renderHook((props) => useMood(...props), {
      initialProps,
    })
    expect(result.current).toEqual(['excited'])

    rerender([{ angry: 30, excited: 30 }, moodRules])
    expect(result.current).toEqual(['angry', 'excited'])

    rerender([{ angry: 30, excited: 20 }, moodRules])
    expect(result.current).toEqual(['angry'])

    rerender([{ angry: 20, excited: 20 }, moodRules])
    expect(result.current).toEqual([])
  })
})

describe('useCharCodes', () => {
  it('should return char codes matching the provided map', () => {
    const moods = ['angry']
    const charCodes = { angry: [1, 2], excited: [1, 3] }
    const initialProps = [moods, charCodes] as const
    const { result, rerender } = renderHook((props) => useCharCodes(...props), {
      initialProps,
    })
    expect(result.current).toEqual([1, 2])

    rerender([['angry', 'excited'], { angry: [1, 2], excited: [1, 3] }])
    expect(result.current).toEqual([1, 2, 3])

    rerender([[], { angry: [1, 2], excited: [1, 3] }])
    expect(result.current).toEqual([])
  })
})

describe('useExampleState', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should provide example state', () => {
    const { result } = renderHook(() => useExampleState())

    expect(result.current[0]).toEqual({
      name: 'Skelly',
      mood: ['happy'],
      charCodes: [128513],
      energy: 100,
      saturation: 50,
      sleep: false,
    })

    let energy = result.current[0].energy
    const saturation = result.current[0].saturation

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current[0].saturation).toBeLessThan(saturation)
    expect(result.current[0].energy).toBeLessThan(energy)

    energy = result.current[0].energy
    act(() => result.current[1].rest())
    expect(result.current[0].sleep).toBe(true)
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current[0].energy).toBeGreaterThan(energy)
    expect(result.current[0].saturation).toBeLessThan(saturation)

    act(() => result.current[1].wakeUp())

    expect(result.current[0].sleep).toBe(false)
    energy = result.current[0].energy

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current[0].energy).toBeLessThan(energy)

    act(() => result.current[1].eat({ energy: 100, saturation: 100 }))

    expect(result.current[0]).toEqual(
      expect.objectContaining({
        mood: ['happy'],
        charCodes: [128513],
        energy: 100,
        saturation: 100,
      })
    )

    act(() => result.current[1].eat({ energy: -75, saturation: 0 }))

    expect(result.current[0]).toEqual(
      expect.objectContaining({
        mood: ['freaking', 'tired'],
        charCodes: [129322, 128164],
        energy: 25,
        saturation: 100,
      })
    )

    act(() => result.current[1].eat({ energy: 0, saturation: -85 }))

    expect(result.current[0]).toEqual(
      expect.objectContaining({
        mood: ['freaking', 'ravenous', 'tired'],
        charCodes: [129322, 127860, 128164],
        energy: 25,
        saturation: 15,
      })
    )

    act(() => result.current[1].rename('John'))

    expect(result.current[0].name).toBe('John')
  })
})
