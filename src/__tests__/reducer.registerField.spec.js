import { registerField } from '../actions'

const describeRegisterField = (reducer, expect, { fromJS, empty }) => () => {
  it('should create registeredFields if it does not exist and a field', () => {
    const state = reducer(fromJS({
      foo: {}
    }), registerField('foo', 'bar', 'Field' ))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [ { name: 'bar', type: 'Field' } ]
        }
      })
  })

  it('should add a field to registeredFields and set syncErrors', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [ { name: 'baz', type: 'FieldArray' } ]
      }
    }), registerField('foo', 'bar', 'Field', empty))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'baz', type: 'FieldArray' },
            { name: 'bar', type: 'Field' }
          ],
          syncErrors: empty
        }
      })
  })

  it('should do nothing if the field already exists', () => {
    const initialState = fromJS({
      foo: {
        registeredFields: [ { name: 'bar', type: 'FieldArray' } ]
      }
    })
    const state = reducer(initialState, registerField('foo', 'bar', 'Field' ))
    expect(state)
      .toEqual(initialState)
  })
}

export default describeRegisterField
