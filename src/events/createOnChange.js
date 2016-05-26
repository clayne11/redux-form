import getValue from './getValue'
import isReactNative from '../isReactNative'
import getSyncErrors from '../getSyncErrors'

const createOnChange = (
  change,
  syncValidate,
  getAllValuesAndProps,
  name,
  structure) =>
  event => {
    const value = getValue(event, isReactNative)
    const syncErrors = getSyncErrors({
      value, getAllValuesAndProps, name, syncValidate
    }, structure)
    change(value, syncErrors)
  }

export default createOnChange
