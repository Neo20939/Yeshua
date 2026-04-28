/**
 * useCurrentTerm - Shared academic year and term helpers
 */

export interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
  academicYear: string
}

export const useCurrentTerm = () => {
  const currentTerm = ref<Term | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch the current academic term
   */
  const fetchCurrentTerm = async () => {
    const api = useApi()
    isLoading.value = true

    try {
      const response = await api.get<Term>('/api-proxy/terms/current')
      currentTerm.value = response
      error.value = null
    }
    catch (err) {
      error.value = 'Failed to load current term'
      console.error(err)
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Get the academic year display string
   */
  const academicYearDisplay = computed(() => {
    if (!currentTerm.value)
      return 'N/A'
    return currentTerm.value.academicYear
  })

  /**
   * Check if a date falls within the current term
   */
  const isDateInTerm = (date: string | Date): boolean => {
    if (!currentTerm.value)
      return false

    const checkDate = new Date(date).getTime()
    const startDate = new Date(currentTerm.value.startDate).getTime()
    const endDate = new Date(currentTerm.value.endDate).getTime()

    return checkDate >= startDate && checkDate <= endDate
  }

  // Load current term on setup
  onMounted(() => {
    fetchCurrentTerm()
  })

  return {
    currentTerm: readonly(currentTerm),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCurrentTerm,
    academicYearDisplay,
    isDateInTerm,
  }
}
