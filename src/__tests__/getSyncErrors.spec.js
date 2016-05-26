import getSyncErrors from '../getSyncErrors'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeGetSyncErrors = (name, structure, expect) => {
  const { empty, getIn } = structure

  describe(name, () => {
    it('should return undefined if there is no syncValidate function', () => {
      const syncValidate = undefined
      const getAllValuesAndProps = () => ({ allValues: empty, props: {} })
      const name = 'foo'
      const value = 'bar'
      const syncErrors = getSyncErrors({
        getAllValuesAndProps, syncValidate, name, value
      }, structure)
      expect(syncErrors).toNotExist()
    })

    it('should return the updated syncErrors', () => {
      const syncValidate = (values) => {
        const errors = {
          test: 'baz'
        }
        if (getIn(values, 'foo') === 'bar') {
          errors.foo = 'fail'
        }
        return errors
      }
      const getAllValuesAndProps = () => ({ allValues: empty, props: {} })
      const name = 'foo'
      const value = 'bar'
      const syncErrors = getSyncErrors({
        getAllValuesAndProps, syncValidate, name, value
      }, structure)
      expect(syncErrors).toEqual({
        test: 'baz',
        foo: 'fail'
      })
    })
  })
}

describeGetSyncErrors('getSyncErrors.plain', plain, addExpectations(plainExpectations))
describeGetSyncErrors('getSyncErrors.immutable', immutable, addExpectations(immutableExpectations))
