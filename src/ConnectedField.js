import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import { partial, mapValues } from 'lodash'
import getSyncErrors from './getSyncErrors'

const createConnectedField = ({
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
  const { deepEqual, getIn, empty } = structure

  const propInitialValue = initialValues && getIn(initialValues, name)

  class ConnectedField extends Component {
    componentWillMount() {
      const {
        getAllValuesAndProps,
        name,
        value
      } = this.props
      const syncErrors = getSyncErrors({
        value, getAllValuesAndProps, name, syncValidate
      }, structure)
      registerField(name, 'Field', syncErrors)
    }

    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
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
      const { component, defaultValue, withRef, getAllValuesAndProps, ...rest } = this.props
      const { _reduxForm: { adapter } } = this.context
      const props = createFieldProps(structure,
        name,
        rest,
        defaultValue,
        syncValidate,
        asyncValidate,
        getAllValuesAndProps
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      let element
      if (adapter) {
        element = adapter(component, props)
      }
      if (!element) {
        element = createElement(component, props)
      }
      return element
    }
  }

  ConnectedField.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any,
    getAllValuesAndProps: PropTypes.func.isRequired
  }

  ConnectedField.contextTypes = {
    _reduxForm: PropTypes.object
  }

  let allValues = empty
  const getAllValuesAndProps = () => ({ allValues, props: getFormProps() })

  const actions = mapValues({ blur, change, focus }, actionCreator => partial(actionCreator, name))
  const connector = connect(
    (state, ownProps) => {
      // update allValues so that they can be fetched when a field is changed
      allValues = getIn(getFormState(state), 'values') || empty

      const initial = getIn(getFormState(state), `initial.${name}`) || propInitialValue
      const value = getIn(getFormState(state), `values.${name}`)
      const pristine = value === initial
      let syncError = getIn(getFormState(state), `syncErrors.${name}`)
      syncError = syncError && getIn(syncError, '_error') ?
        getIn(syncError, '_error') : syncError
      return {
        asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
        asyncValidating: getIn(getFormState(state), 'asyncValidating') === name,
        dirty: !pristine,
        getAllValuesAndProps,
        pristine,
        state: getIn(getFormState(state), `fields.${name}`),
        submitError: getIn(getFormState(state), `submitErrors.${name}`),
        syncError,
        value,
        _value: ownProps.value // save value passed in (for checkboxes)
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
