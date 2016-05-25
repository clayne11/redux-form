import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnChange = (
  change,
  syncValidate,
  getAllValues,
  name,
  { setIn, empty }) =>
  event => {
    const value = getValue(event, isReactNative)
    const allValues = getAllValues() || empty
    const newAllValues = setIn(allValues, name, value)
    const allErrors = syncValidate(newAllValues)
    change(value, allErrors)
  }

export default createOnChange
