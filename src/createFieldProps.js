import createOnBlur from './events/createOnBlur'
import createOnChange from './events/createOnChange'
import createOnDragStart from './events/createOnDragStart'
import createOnDrop from './events/createOnDrop'
import createOnFocus from './events/createOnFocus'
import { partial, noop } from 'lodash'

const processProps = (props, _value) => {
  const { type, value, ...rest } = props
  if (type === 'checkbox') {
    return {
      ...rest,
      checked: !!value,
      type
    }
  }
  if (type === 'radio') {
    return {
      ...rest,
      checked: value === _value,
      type,
      value: _value
    }
  }
  if (type === 'select-multiple') {
    return {
      ...rest,
      type,
      value: value || []
    }
  }
  return props
}

const createFieldProps = ({ getIn, setIn, empty }, name,
  { asyncError, blur, change, dirty, focus, pristine, state, submitError,
    value, _value, ...rest }, syncError, defaultValue = '', syncValidate = noop,
    asyncValidate = noop, getAllValuesAndProps) => {
  const error = syncError || asyncError || submitError
  const onChange = createOnChange(change, syncValidate, getAllValuesAndProps, name,
    { getIn, setIn, empty })
  return processProps({
    active: state && !!getIn(state, 'active'),
    dirty,
    error,
    invalid: !!error,
    name,
    onBlur: createOnBlur(blur, partial(asyncValidate, name)),
    onChange,
    onDragStart: createOnDragStart(name, value),
    onDrop: createOnDrop(name, change),
    onFocus: createOnFocus(name, focus),
    onUpdate: onChange,
    pristine,
    touched: !!(state && getIn(state, 'touched')),
    valid: !error,
    value: value == null ? defaultValue : value,
    visited: state && !!getIn(state, 'visited'),
    ...rest
  }, _value)
}

export default createFieldProps
