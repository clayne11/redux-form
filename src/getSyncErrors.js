export default ({
  name, value, syncValidate, getAllValuesAndProps
}, { setIn }) => {
  const { allValues, props } = getAllValuesAndProps()
  const newAllValues = setIn(allValues, name, value)
  return syncValidate && syncValidate(newAllValues, props)
}
