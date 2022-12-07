import 'pinia'
import type { EntitiesState } from '~/types/State'

// declare module 'pinia' {
//   export interface PiniaCustomProperties {
//     // by using a setter we can allow both strings and refs
//     set hello(value: string | Ref<string>)
//     get hello(): string

//     // you can define simpler values too
//     simpleNumber: number
//   }
// }

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    // allow defining a number of ms for any of the actions
    entityStoreOptions?: {
      isEntityStore: boolean
    }
  }

  export interface PiniaCustomStateProperties<S> {
    entities: EntitiesState<S>
  }
}
