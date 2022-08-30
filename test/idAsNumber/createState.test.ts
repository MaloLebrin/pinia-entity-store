import { hasOwnProperty } from '@antfu/utils'
import { userState } from '../utils/baseState'

describe('createState suite tests', () => {
  it('createState ownProperty of an state by default', () => {
    expect(hasOwnProperty(userState, 'entities')).toBeTruthy()

    expect(hasOwnProperty(userState.entities, 'byId')).toBeTruthy()
    expect(hasOwnProperty(userState.entities, 'allIds')).toBeTruthy()
    expect(hasOwnProperty(userState.entities, 'current')).toBeTruthy()

    expect(hasOwnProperty(userState.entities, 'active')).toBeTruthy()
  })

  it('default values of userState', () => {
    expect(userState.entities.current).toBe(null)
    expect(!noNull(userState.entities.current)).toBeTruthy()
    expect(userState.entities.allIds).toEqual([])
    expect(userState.entities.byId).toEqual({})
    expect(userState.entities.active).toEqual([])
  })
})
