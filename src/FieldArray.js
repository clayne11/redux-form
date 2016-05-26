import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import shallowCompare from 'react-addons-shallow-compare'

const createFieldArray = (structure) => {

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
      this.ConnectedFieldArray =
        createConnectedFieldArray(context._reduxForm, structure, props.name)
    }

    shouldComponentUpdate(nextProps) {
      return shallowCompare(this, nextProps)
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedFieldArray =
          createConnectedFieldArray(this.context._reduxForm, structure, nextProps.name)
      }
    }

    get name() {
      return this.props.name
    }

    get dirty() {
      return this.refs.connected.getWrappedInstance().dirty
    }

    get pristine() {
      return this.refs.connected.getWrappedInstance().pristine
    }

    get value() {
      return this.refs.connected.getWrappedInstance().value
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to FieldArray')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(this.ConnectedFieldArray, {
        ...this.props,
        ref: 'connected'
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
