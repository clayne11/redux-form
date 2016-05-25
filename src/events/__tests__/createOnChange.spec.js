import { createSpy } from 'expect'
import createOnChange from '../createOnChange'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const noop = () => {}

const describeCreateOnChange = (name, structure, expect) => {
  const { empty, fromJS } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(createOnChange(noop, noop, noop, 'foo', { setIn: noop, empty }))
        .toExist()
        .toBeA('function')
    })

    it('should return a function that calls change with name, value, and errors', () => {
      const change = createSpy()
      const errors = fromJS({ bar: 'test' })
      createOnChange(change, () => errors, () => ({ allValues: empty, props: {} }),
        'bar', { setIn: noop, empty })('bar')
      expect(change)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('bar', errors)
    })
  })
}

describeCreateOnChange('createOnChange.plain', plain, addExpectations(plainExpectations))
describeCreateOnChange('createOnChange.immutable', immutable, addExpectations(immutableExpectations))
