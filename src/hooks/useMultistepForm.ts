// hooks/useMultistepForm.ts
import { useState } from "react"

export function useMultistepForm(stepsCount: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= stepsCount - 1) return i
      return i + 1
    })
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i
      return i - 1
    })
  }

  function goTo(index: number) {
    setCurrentStepIndex(index)
  }

  return {
    currentStepIndex,
    step: currentStepIndex + 1,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === stepsCount - 1,
    next,
    back,
    goTo,
  }
}