export const useMainStore = defineStore('main', {
  state: () => ({ isTest: true }),
  getters: {
    getIsTest: state => state.isTest,
  },
  actions: {

  },
  entityStoreOptions: {
    isEntityStore: true,
  },
})

export default useMainStore
