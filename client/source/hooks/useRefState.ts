import { useCallback, useRef, useState, useEffect, MutableRefObject, Dispatch, SetStateAction } from 'react'

export const isObject = (obj: any): obj is object => Object.prototype.toString.call(obj) === '[object Object]' // eslint-disable-line

const useMounted = () => {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return mounted
}

export function useRefState<S>(
  initialState: S | (() => S),
  blockIfUnmounted: boolean = true
): [MutableRefObject<S>, Dispatch<SetStateAction<S>>] {
  const mounted = useMounted()
  const [reactState, setReactState] = useState(initialState)
  const state = useRef(reactState)
  const setState: Dispatch<SetStateAction<S>> = useCallback((arg) => {
    if (!mounted.current && blockIfUnmounted) return
    state.current = (typeof arg === 'function') ? (arg as any)(state.current) : arg
    setReactState(state.current)
  }, [])
  return [state, setState]
}

export default useRefState
