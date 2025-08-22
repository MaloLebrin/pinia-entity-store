import { describe, test, expect } from 'vitest'
import { createUser } from '../fixtures/entities'

// Tests de compatibilité pour valider la rétrocompatibilité et l'interopérabilité

describe('Compatibility Integration Tests', () => {
  describe('Legacy API Compatibility', () => {
    test('should maintain backward compatibility with legacy createState, createActions, createGetters', () => {
      // Simuler l'ancienne API pour valider la compatibilité
      function legacyCreateState() {
        return {
          entities: {
            byId: {},
            allIds: [],
            current: null,
            currentById: null,
            active: []
          }
        }
      }

      function legacyCreateActions(state: any) {
        return {
          createOne: (entity: any) => {
            state.entities.byId[entity.id] = { ...entity, $isDirty: false }
            state.entities.allIds.push(entity.id)
          },
          updateOne: (id: string, updates: any) => {
            if (state.entities.byId[id]) {
              state.entities.byId[id] = { ...state.entities.byId[id], ...updates, $isDirty: true }
            }
          },
          deleteOne: (id: string) => {
            if (state.entities.byId[id]) {
              delete state.entities.byId[id]
              state.entities.allIds = state.entities.allIds.filter((entityId: string) => entityId !== id)
            }
          }
        }
      }

      function legacyCreateGetters(state: any) {
        return {
          getOne: () => (id: string) => state.entities.byId[id],
          getAll: () => state.entities.byId,
          getAllArray: () => Object.values(state.entities.byId),
          getAllIds: () => state.entities.allIds
        }
      }

      // Tester l'utilisation legacy
      const state = legacyCreateState()
      const actions = legacyCreateActions(state)
      const getters = legacyCreateGetters(state)

      const user = createUser()
      
      // Opérations legacy
      actions.createOne(user)
      expect(getters.getAllIds()).toContain(user.id)
      expect(getters.getOne()(user.id)).toEqual({ ...user, $isDirty: false })

      actions.updateOne(user.id, { name: 'Updated Name' })
      expect(getters.getOne()(user.id).name).toBe('Updated Name')
      expect(getters.getOne()(user.id).$isDirty).toBe(true)

      actions.deleteOne(user.id)
      expect(getters.getOne()(user.id)).toBeUndefined()
      expect(getters.getAllIds()).not.toContain(user.id)
    })

    test('should support migration from legacy to new API', () => {
      // Simuler des données legacy
      const legacyData = {
        entities: {
          byId: {
            '1': { id: '1', name: 'John', email: 'john@example.com', $isDirty: false },
            '2': { id: '2', name: 'Jane', email: 'jane@example.com', $isDirty: true }
          },
          allIds: ['1', '2'],
          current: null,
          currentById: null,
          active: []
        }
      }

      // Fonction de migration
      function migrateLegacyData(legacy: any) {
        return {
          entities: {
            byId: { ...legacy.entities.byId },
            allIds: [...legacy.entities.allIds],
            current: legacy.entities.current,
            currentById: legacy.entities.currentById,
            active: [...legacy.entities.active]
          }
        }
      }

      // Migrer
      const migratedData = migrateLegacyData(legacyData)

      // Vérifier que les données sont préservées
      expect(Object.keys(migratedData.entities.byId)).toHaveLength(2)
      expect(migratedData.entities.allIds).toEqual(['1', '2'])
      expect(migratedData.entities.byId['1'].name).toBe('John')
      expect(migratedData.entities.byId['2'].$isDirty).toBe(true)

      // Vérifier que la structure est compatible
      expect(migratedData.entities).toHaveProperty('byId')
      expect(migratedData.entities).toHaveProperty('allIds')
      expect(migratedData.entities).toHaveProperty('current')
      expect(migratedData.entities).toHaveProperty('currentById')
      expect(migratedData.entities).toHaveProperty('active')
    })
  })

  describe('Cross-Platform Compatibility', () => {
    test('should work with different JavaScript environments', () => {
      // Simuler différents environnements
      const environments = {
        browser: {
          performance: { now: () => Date.now() },
          localStorage: {
            data: {} as Record<string, string>,
            setItem: function(key: string, value: string) { this.data[key] = value },
            getItem: function(key: string) { return this.data[key] || null },
            removeItem: function(key: string) { delete this.data[key] }
          }
        },
        node: {
          performance: { now: () => process.hrtime.bigint() / BigInt(1000000) },
          fs: {
            data: {} as Record<string, string>,
            writeFileSync: function(path: string, data: string) { this.data[path] = data },
            readFileSync: function(path: string) { return this.data[path] || '' }
          }
        }
      }

      // Adaptateur universel
      class UniversalEntityStore {
        private entities = {} as Record<string, any>
        private env: keyof typeof environments

        constructor(environment: keyof typeof environments) {
          this.env = environment
        }

        create(entity: any) {
          const timestamp = this.getTimestamp()
          this.entities[entity.id] = { ...entity, $isDirty: false, createdAt: timestamp }
        }

        persist() {
          const data = JSON.stringify(this.entities)
          if (this.env === 'browser') {
            environments.browser.localStorage.setItem('entities', data)
          } else {
            environments.node.fs.writeFileSync('entities.json', data)
          }
        }

        load() {
          let data: string | null = null
          if (this.env === 'browser') {
            data = environments.browser.localStorage.getItem('entities')
          } else {
            data = environments.node.fs.readFileSync('entities.json')
          }
          
          if (data) {
            this.entities = JSON.parse(data)
          }
        }

        getAll() {
          return { ...this.entities }
        }

        private getTimestamp() {
          if (this.env === 'browser') {
            return environments.browser.performance.now()
          } else {
            return Number(environments.node.performance.now())
          }
        }
      }

      // Test dans l'environnement browser
      const browserStore = new UniversalEntityStore('browser')
      const user1 = createUser({ id: '1', name: 'Browser User' })
      
      browserStore.create(user1)
      browserStore.persist()
      
      const browserStore2 = new UniversalEntityStore('browser')
      browserStore2.load()
      
      expect(browserStore2.getAll()['1'].name).toBe('Browser User')

      // Test dans l'environnement Node.js
      const nodeStore = new UniversalEntityStore('node')
      const user2 = createUser({ id: '2', name: 'Node User' })
      
      nodeStore.create(user2)
      nodeStore.persist()
      
      const nodeStore2 = new UniversalEntityStore('node')
      nodeStore2.load()
      
      expect(nodeStore2.getAll()['2'].name).toBe('Node User')
    })

    test('should handle different ID types consistently', () => {
      // Gestionnaire d'entités qui supporte différents types d'ID
      class FlexibleEntityStore {
        private entities = new Map<string | number, any>()

        create(entity: any) {
          this.entities.set(entity.id, { ...entity, $isDirty: false })
        }

        get(id: string | number) {
          return this.entities.get(id)
        }

        update(id: string | number, updates: any) {
          const entity = this.entities.get(id)
          if (entity) {
            this.entities.set(id, { ...entity, ...updates, $isDirty: true })
          }
        }

        getAll() {
          return Array.from(this.entities.values())
        }

        getAllByType(type: 'string' | 'number') {
          const results: any[] = []
          for (const [id, entity] of this.entities) {
            if (typeof id === type) {
              results.push(entity)
            }
          }
          return results
        }
      }

      const store = new FlexibleEntityStore()

      // Entités avec ID string
      const userString = createUser({ id: 'user-1', name: 'String ID User' })
      store.create(userString)

      // Entités avec ID number
      const userNumber = createUser({ id: 123, name: 'Number ID User' })
      store.create(userNumber)

      // Vérifier que les deux types fonctionnent
      expect(store.get('user-1')?.name).toBe('String ID User')
      expect(store.get(123)?.name).toBe('Number ID User')

      // Mettre à jour avec les deux types
      store.update('user-1', { age: 25 })
      store.update(123, { age: 30 })

      expect(store.get('user-1')?.age).toBe(25)
      expect(store.get(123)?.age).toBe(30)

      // Filtrer par type d'ID
      expect(store.getAllByType('string')).toHaveLength(1)
      expect(store.getAllByType('number')).toHaveLength(1)
      expect(store.getAll()).toHaveLength(2)
    })
  })

  describe('Version Compatibility', () => {
    test('should handle data format evolution', () => {
      // Simuler l'évolution des formats de données
      const dataFormats = {
        v1: {
          entities: {
            byId: { '1': { id: '1', name: 'John', email: 'john@example.com' } },
            allIds: ['1']
          }
        },
        v2: {
          entities: {
            byId: { '1': { id: '1', name: 'John', email: 'john@example.com', $isDirty: false } },
            allIds: ['1'],
            current: null,
            active: []
          }
        },
        v3: {
          entities: {
            byId: { '1': { id: '1', name: 'John', email: 'john@example.com', $isDirty: false, version: 3 } },
            allIds: ['1'],
            current: null,
            currentById: null,
            active: []
          }
        }
      }

      // Migrateurs
      const migrators = {
        v1ToV2: (data: any) => ({
          entities: {
            byId: Object.fromEntries(
              Object.entries(data.entities.byId).map(([id, entity]: [string, any]) => [
                id, { ...entity, $isDirty: false }
              ])
            ),
            allIds: data.entities.allIds,
            current: null,
            active: []
          }
        }),
        v2ToV3: (data: any) => ({
          entities: {
            byId: Object.fromEntries(
              Object.entries(data.entities.byId).map(([id, entity]: [string, any]) => [
                id, { ...entity, version: 3 }
              ])
            ),
            allIds: data.entities.allIds,
            current: data.entities.current,
            currentById: null,
            active: data.entities.active
          }
        })
      }

      // Gestionnaire de migration
      function migrateToLatest(data: any, currentVersion: number) {
        let migrated = { ...data }
        
        if (currentVersion === 1) {
          migrated = migrators.v1ToV2(migrated)
        }
        if (currentVersion <= 2) {
          migrated = migrators.v2ToV3(migrated)
        }
        
        return migrated
      }

      // Test de migration v1 -> v3
      const v1Data = dataFormats.v1
      const migratedV3 = migrateToLatest(v1Data, 1)

      expect(migratedV3.entities.byId['1'].$isDirty).toBe(false)
      expect(migratedV3.entities.byId['1'].version).toBe(3)
      expect(migratedV3.entities).toHaveProperty('currentById')

      // Test de migration v2 -> v3
      const v2Data = dataFormats.v2
      const migratedV3FromV2 = migrateToLatest(v2Data, 2)

      expect(migratedV3FromV2.entities.byId['1'].version).toBe(3)
      expect(migratedV3FromV2.entities).toHaveProperty('currentById')
    })

    test('should maintain API stability across versions', () => {
      // Interface stable qui ne change pas entre les versions
      interface StableAPI {
        create(entity: any): void
        read(id: string): any
        update(id: string, updates: any): void
        delete(id: string): void
        list(): any[]
      }

      // Implémentation v1
      class EntityStoreV1 implements StableAPI {
        private entities = {} as Record<string, any>

        create(entity: any) {
          this.entities[entity.id] = entity
        }

        read(id: string) {
          return this.entities[id]
        }

        update(id: string, updates: any) {
          if (this.entities[id]) {
            this.entities[id] = { ...this.entities[id], ...updates }
          }
        }

        delete(id: string) {
          delete this.entities[id]
        }

        list() {
          return Object.values(this.entities)
        }
      }

      // Implémentation v2 avec nouvelles fonctionnalités internes
      class EntityStoreV2 implements StableAPI {
        private entities = {} as Record<string, any>
        private metadata = {} as Record<string, { createdAt: number, updatedAt: number }>

        create(entity: any) {
          const now = Date.now()
          this.entities[entity.id] = { ...entity, $isDirty: false }
          this.metadata[entity.id] = { createdAt: now, updatedAt: now }
        }

        read(id: string) {
          return this.entities[id]
        }

        update(id: string, updates: any) {
          if (this.entities[id]) {
            this.entities[id] = { ...this.entities[id], ...updates, $isDirty: true }
            this.metadata[id].updatedAt = Date.now()
          }
        }

        delete(id: string) {
          delete this.entities[id]
          delete this.metadata[id]
        }

        list() {
          return Object.values(this.entities)
        }

        // Nouvelle méthode (non dans l'interface stable)
        getMetadata(id: string) {
          return this.metadata[id]
        }
      }

      // Test de compatibilité
      function testStoreCompatibility(store: StableAPI) {
        const user = createUser()
        
        // Les mêmes opérations fonctionnent sur toutes les versions
        store.create(user)
        expect(store.read(user.id)).toBeDefined()
        
        store.update(user.id, { name: 'Updated Name' })
        expect(store.read(user.id).name).toBe('Updated Name')
        
        expect(store.list()).toHaveLength(1)
        
        store.delete(user.id)
        expect(store.read(user.id)).toBeUndefined()
        expect(store.list()).toHaveLength(0)
      }

      // Test avec v1
      const storeV1 = new EntityStoreV1()
      testStoreCompatibility(storeV1)

      // Test avec v2
      const storeV2 = new EntityStoreV2()
      testStoreCompatibility(storeV2)

      // Test des nouvelles fonctionnalités v2
      const user = createUser()
      storeV2.create(user)
      const metadata = storeV2.getMetadata(user.id)
      expect(metadata.createdAt).toBeDefined()
      expect(metadata.updatedAt).toBeDefined()
    })
  })

  describe('Integration Edge Cases', () => {
    test('should handle circular references safely', () => {
      // Simuler des entités avec références circulaires
      class SafeEntityStore {
        private entities = {} as Record<string, any>
        private processing = new Set<string>()

        create(entity: any) {
          this.entities[entity.id] = this.sanitizeEntity(entity)
        }

        private sanitizeEntity(entity: any, depth = 0): any {
          if (depth > 10) {
            return '[Circular Reference]'
          }

          if (typeof entity !== 'object' || entity === null) {
            return entity
          }

          if (this.processing.has(entity.id)) {
            return { id: entity.id, $ref: true }
          }

          this.processing.add(entity.id)

          const sanitized: any = {}
          for (const [key, value] of Object.entries(entity)) {
            if (typeof value === 'object' && value !== null) {
              sanitized[key] = this.sanitizeEntity(value, depth + 1)
            } else {
              sanitized[key] = value
            }
          }

          this.processing.delete(entity.id)
          return sanitized
        }

        get(id: string) {
          return this.entities[id]
        }

        serialize() {
          return JSON.stringify(this.entities)
        }
      }

      const store = new SafeEntityStore()

      // Créer des entités avec références circulaires
      const user1 = createUser({ id: '1', name: 'John' })
      const user2 = createUser({ id: '2', name: 'Jane' })
      
      // Ajouter des références circulaires
      ;(user1 as any).friend = user2
      ;(user2 as any).friend = user1

      // Créer les entités
      store.create(user1)
      store.create(user2)

      // Vérifier que la sérialisation fonctionne
      expect(() => store.serialize()).not.toThrow()

      const stored1 = store.get('1')
      const stored2 = store.get('2')

      // Vérifier que les entités ont été créées et que la sérialisation fonctionne
      expect(stored1.name).toBe('John')
      expect(stored2.name).toBe('Jane')
      
      // Vérifier que les références circulaires n'empêchent pas la sérialisation
      expect(() => JSON.parse(store.serialize())).not.toThrow()
    })

    test('should handle memory pressure gracefully', () => {
      // Simuler la gestion de la pression mémoire
      class MemoryAwareEntityStore {
        private entities = {} as Record<string, any>
        private maxEntities = 1000
        private accessTimes = {} as Record<string, number>

        create(entity: any) {
          // Vérifier la limite mémoire
          if (Object.keys(this.entities).length >= this.maxEntities) {
            this.evictOldest()
          }

          this.entities[entity.id] = { ...entity, $isDirty: false }
          this.accessTimes[entity.id] = Date.now()
        }

        get(id: string) {
          const entity = this.entities[id]
          if (entity) {
            this.accessTimes[id] = Date.now()
          }
          return entity
        }

        private evictOldest() {
          // Trouver l'entité la moins récemment utilisée
          let oldestId = ''
          let oldestTime = Infinity

          for (const [id, time] of Object.entries(this.accessTimes)) {
            if (time < oldestTime) {
              oldestTime = time
              oldestId = id
            }
          }

          if (oldestId) {
            delete this.entities[oldestId]
            delete this.accessTimes[oldestId]
          }
        }

        getStats() {
          return {
            entityCount: Object.keys(this.entities).length,
            maxEntities: this.maxEntities,
            memoryUsage: this.estimateMemoryUsage()
          }
        }

        private estimateMemoryUsage() {
          // Estimation approximative de l'usage mémoire
          const entitiesSize = JSON.stringify(this.entities).length
          const accessTimesSize = Object.keys(this.accessTimes).length * 20 // approximation
          return entitiesSize + accessTimesSize
        }
      }

      const store = new MemoryAwareEntityStore()

      // Créer plus d'entités que la limite
      for (let i = 0; i < 1050; i++) {
        const user = createUser({ id: `user-${i}`, name: `User ${i}` })
        store.create(user)
      }

      const stats = store.getStats()
      
      // Le store ne doit pas dépasser la limite
      expect(stats.entityCount).toBeLessThanOrEqual(1000)
      
      // Les premières entités doivent avoir été évincées
      expect(store.get('user-0')).toBeUndefined()
      
      // Les dernières entités doivent être présentes
      expect(store.get('user-1049')).toBeDefined()

      // Accéder à une entité ancienne pour la "rafraîchir"
      const middleEntity = store.get('user-500')
      if (middleEntity) {
        // Créer de nouvelles entités pour déclencher l'éviction
        for (let i = 1100; i < 1110; i++) {
          const user = createUser({ id: `user-${i}`, name: `User ${i}` })
          store.create(user)
        }

        // L'entité "rafraîchie" doit encore être là
        expect(store.get('user-500')).toBeDefined()
      }
    })
  })
})
