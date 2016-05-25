import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnChange = (
  change,
  syncValidate,
  getAllValuesAndProps,
  name,
  { setIn, empty }) =>
  event => {
    const value = getValue(event, isReactNative)
    const { allValues, props } = getAllValuesAndProps()
    const newAllValues = setIn(allValues, name, value)
    const allErrors = syncValidate(newAllValues, props) || empty
    change(value, allErrors)
  }

export default createOnChange
