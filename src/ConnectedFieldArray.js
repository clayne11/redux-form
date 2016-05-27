import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldArrayProps from './createFieldArrayProps'
import { partial, mapValues } from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'
import getSyncErrors from './getSyncErrors'

const createConnectedFieldArray = ({
  arrayInsert,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  asyncValidate,
  blur,
  change,
  focus,
  getFormProps,
  getFormState,
  initialValues,
  registerField,
  syncValidate,
  unregisterField
}, structure, name) => {
  const { deepEqual, empty, getIn } = structure

  const propInitialValue = initialValues && getIn(initialValues, name)

  class ConnectedFieldArray extends Component {
    componentWillMount() {
      const {
        getAllValuesAndProps,
        name,
        value
      } = this.props
      const syncErrors = getSyncErrors({
        value, getAllValuesAndProps, name, syncValidate
      }, structure)
      registerField(name, 'FieldArray', syncErrors)
    }

    shouldComponentUpdate(nextProps) {
      return shallowCompare(this.props, nextProps)
    }

    componentWillUnmount() {
      unregisterField(this.props.name)
    }

    get dirty() {
      return this.props.dirty
    }

    get pristine() {
      return this.props.pristine
    }

    get value() {
      return this.props.value
    }

    getRenderedComponent() {
      return this.refs.renderedComponent
    }

    render() {
      const { component, withRef, ...rest } = this.props
      const props = createFieldArrayProps(structure, name, rest)
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return createElement(component, props)
    }
  }

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  let allValues = empty
  const getAllValuesAndProps = () => ({ allValues, props: getFormProps() })

  const actions = mapValues({
    arrayInsert,
    arrayPop,
    arrayPush,
    arrayRemove,
    arrayShift,
    arraySplice,
    arraySwap,
    arrayUnshift
  }, actionCreator => partial(actionCreator, name))
  const connector = connect(
    state => {
      // update allValues so that they can be fetched when a field is changed
      allValues = getIn(getFormState(state), 'values') || empty

      const initial = getIn(getFormState(state), `initial.${name}`) || propInitialValue
      const value = getIn(getFormState(state), `values.${name}`)
      const pristine = deepEqual(value, initial)
      return {
        syncError: getIn(getFormState(state), `syncErrors.${name}._error`),
        asyncError: getIn(getFormState(state), `asyncErrors.${name}._error`),
        dirty: !pristine,
        getAllValuesAndProps,
        pristine,
        submitError: getIn(getFormState(state), `submitErrors.${name}._error`),
        value
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
