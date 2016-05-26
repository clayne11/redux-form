import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import { partial, mapValues } from 'lodash'

const createConnectedField = ({
  syncValidate,
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
}, { deepEqual, getIn, setIn, empty }, name) => {

  const propInitialValue = initialValues && getIn(initialValues, name)

  class ConnectedField extends Component {
    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
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
      const props = createFieldProps({ getIn, setIn, empty },
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
  let props
  const getAllValuesAndProps = () => ({ allValues, props })

  const actions = mapValues({ blur, change, focus }, actionCreator => partial(actionCreator, name))
  const connector = connect(
    (state, ownProps) => {
      // update allValues so that they can be fetched when a field is changed
      allValues = getIn(getFormState(state), 'values') || empty
      props = ownProps

      const initial = getIn(getFormState(state), `initial.${name}`) || propInitialValue
      const value = getIn(getFormState(state), `values.${name}`)
      const pristine = value === initial
      let syncError = getIn(getFormState(state), `syncErrors.${name}`);
      syncError = syncError && getIn(syncError, '_error') ?
        getIn(syncError, '_error') : syncError
      return {
        syncError,
        asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
        asyncValidating: getIn(getFormState(state), 'asyncValidating') === name,
        dirty: !pristine,
        pristine,
        state: getIn(getFormState(state), `fields.${name}`),
        submitError: getIn(getFormState(state), `submitErrors.${name}`),
        value,
        _value: ownProps.value, // save value passed in (for checkboxes)
        getAllValuesAndProps
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
