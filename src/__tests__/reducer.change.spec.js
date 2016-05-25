import { change } from '../actions'

const describeChange = (reducer, expect, { fromJS, empty }) => () => {
  it('should set value on change with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField', 'myValue', empty))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'myValue'
          },
          syncErrors: empty
        }
      })
  })

  it('should set value on change and touch with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField', 'myValue', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should set value on change and touch with initial value', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        },
        syncErrors: empty
      }
    }), change('foo', 'myField', 'myValue', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'myValue'
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should allow setting an initialized field to \'\'', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        },
        syncErrors: empty
      }
    }), change('foo', 'myField', '', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: ''
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should remove a value if on change is set with \'\'', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        },
        syncErrors: empty
      }
    }), change('foo', 'myField', '', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          fields: {
            myField: {
              touched: true
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should NOT remove a value if on change is set with \'\' if it\'s an array field', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: [ 'initialValue' ]
        },
        syncErrors: empty
      }
    }), change('foo', 'myField[0]', '', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: [ undefined ]
          },
          fields: {
            myField: [
              {
                touched: true
              }
            ]
          },
          syncErrors: empty
        }
      })
  })

  it('should remove nested value container if on change clears all values', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          nested: {
            myField: 'initialValue'
          }
        },
        syncErrors: empty
      }
    }), change('foo', 'nested.myField', '', empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          fields: {
            nested: {
              myField: {
                touched: true
              }
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should not modify a value if called with undefined', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        }
      }
    }), change('foo', 'myField', undefined, empty, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          syncErrors: empty
        }
      })
  })

  it('should set value on change and remove field-level submit and async errors', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initial'
        },
        asyncErrors: {
          myField: 'async error'
        },
        submitErrors: {
          myField: 'submit error'
        },
        error: 'some global error'
      }
    }), change('foo', 'myField', 'different', empty, false))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'different'
          },
          syncErrors: empty,
          error: 'some global error' // unaffected by CHANGE
        }
      })
  })

  it('should set nested value on change with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField.mySubField', 'myValue', empty, false))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              mySubField: 'myValue'
            }
          },
          syncErrors: empty
        }
      })
  })
}

export default describeChange
