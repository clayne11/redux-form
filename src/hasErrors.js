const createHasErrors = ({ getIn }) => {
  const hasErrors = errors => {
    if (!errors) {
      return false
    }
    const globalError = getIn(errors, '_error')
    if (globalError && typeof globalError === 'string') {
      return true
    }
    if (typeof errors === 'string') {
      return !!errors
    }
    return false
  }
  return hasErrors
}

export default createHasErrors
