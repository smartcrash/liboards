import { useEventListener } from '@chakra-ui/react'
import { RefObject, useState } from 'react'

// See: https://usehooks-ts.com/react-hook/use-hover

function useHover<T extends HTMLElement = HTMLElement>(elementRef: RefObject<T>): boolean {
  const [value, setValue] = useState<boolean>(false)

  const handleMouseEnter = () => setValue(true)
  const handleMouseLeave = () => setValue(false)

  console.log({ elementRef: elementRef.current });


  useEventListener('mouseenter', handleMouseEnter, () => elementRef.current)
  useEventListener('mouseleave', handleMouseLeave, () => elementRef.current)

  return value
}

export { useHover }
