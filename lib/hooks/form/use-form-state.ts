"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
}

type FormErrors<T> = Partial<Record<keyof T, string>>

/**
 * Hook for managing form state with validation
 */
export function useFormState<T extends Record<string, any>>(initialValues: T, validate?: (values: T) => FormErrors<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  })

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setState((prev) => {
        const newValues = { ...prev.values, [field]: value }
        const newErrors = validate ? validate(newValues) : prev.errors

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          touched: { ...prev.touched, [field]: true },
        }
      })
    },
    [validate],
  )

  const handleBlur = useCallback((field: keyof T) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }))
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      const fieldValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

      setFieldValue(name as keyof T, fieldValue)
    },
    [setFieldValue],
  )

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    })
  }, [initialValues])

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({
      ...prev,
      isSubmitting,
    }))
  }, [])

  const validateForm = useCallback(() => {
    if (!validate) return true

    const errors = validate(state.values)
    const hasErrors = Object.keys(errors).length > 0

    setState((prev) => ({
      ...prev,
      errors,
      touched: Object.keys(prev.values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true
          return acc
        },
        {} as Partial<Record<keyof T, boolean>>,
      ),
    }))

    return !hasErrors
  }, [state.values, validate])

  return {
    ...state,
    setFieldValue,
    handleBlur,
    handleChange,
    resetForm,
    setSubmitting,
    validateForm,
  }
}

