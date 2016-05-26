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
    const syncErrors = syncValidate && syncValidate(newAllValues, props) || empty
    change(value, syncErrors)
  }

export default createOnChange
