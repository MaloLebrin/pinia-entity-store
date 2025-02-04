import { proxy, useSnapshot } from 'valtio'
import createGetters from './createGetters'
import createActions from './createActions'
import type { ValtioAddOptions } from '~/types/valtioEntityStore'
import type { State } from '~/types/State'
import { UserEntity } from '~/test/store/Store'

export function addOptions<T>({ object, state }:
  { object: Record<string, Function>, state: State<T> }) {
  const options = {} as Record<string, Function>

  for (const [key, value] of Object.entries(object)) {
    options[key] = value(state)
  }

  return options
}

export function useEntityStore<T>({
  store,
  snap,
  opts,
}: {
  store: State<T>
  snap?: typeof useSnapshot
  opts: ValtioAddOptions
}) {
  let state
  if (snap) {
    state = snap(store)
  }
  const get = { ...createGetters(state), ...addOptions({ opts?.get, state }) }
  const set = { ...createActions(store), ...addOptions({ opts?.set, store }) } // /!\ ISSUE with STATE
  return { get, set, state }
}

export function defaultSchema<T>(): State<T> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      active: [],
    },
  }
}

export function createValtioState<T extends object>(extendedState: Record<string, any>) {
  return proxy<T>({ ...defaultSchema<T>(), ...extendedState })
}

export const userState = createValtioState<UserEntity>({ title: 'hey' })

const getFirst = (state: State<T>) => () => Object.values(state.entities.byId)[0]
const getOne = (state: State<T>) => (id: number) => state.entities.byId[id]
const changeTitle = (state: State<T>) => (str: string) => (state.title = str)

export const useUserStore = () => {
  return useEntityStore<UserEntity>({
    store: userState,
    snap: useSnapshot,
    opts: {
      get: { getFirst, getOne },
      set: { changeTitle },
    },
  })
}
