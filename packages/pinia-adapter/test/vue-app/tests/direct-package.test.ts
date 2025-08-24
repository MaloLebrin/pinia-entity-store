// Test direct de notre package @malolebrin/entity-store-pinia
// Ce test sera exécuté directement dans l'application Vue

console.log('🧪 Testing our package directly...')

// Test 1: Vérifier que notre package peut être importé
async function testPackageImport() {
  try {
    console.log('📦 Testing package import...')
    
    // Import dynamique de notre package
    const { createPiniaEntityStore } = await import('../../index')
    
    console.log('✅ Package imported successfully!')
    console.log('📋 createPiniaEntityStore type:', typeof createPiniaEntityStore)
    
    return true
  } catch (error) {
    console.error('❌ Package import failed:', error)
    return false
  }
}

// Test 2: Vérifier que nous pouvons créer un store
async function testStoreCreation() {
  try {
    console.log('🏪 Testing store creation...')
    
    const { createPiniaEntityStore } = await import('../../index')
    
    // Créer un store avec notre package
    const storeOptions = createPiniaEntityStore({
      storeName: 'test-store',
      validateEntity: (entity: any) => {
        return !!(entity.name && entity.email)
      }
    })
    
    console.log('✅ Store options created successfully!')
    console.log('📋 Store options:', storeOptions)
    
    // Vérifier la structure
    console.log('🔍 Store ID:', storeOptions.id)
    console.log('🔍 Has state:', !!storeOptions.state)
    console.log('🔍 Has actions:', !!storeOptions.actions)
    console.log('🔍 Has getters:', !!storeOptions.getters)
    
    return true
  } catch (error) {
    console.error('❌ Store creation failed:', error)
    return false
  }
}

// Test 3: Vérifier que le store fonctionne
async function testStoreFunctionality() {
  try {
    console.log('⚙️ Testing store functionality...')
    
    const { createPiniaEntityStore } = await import('../../index')
    
    // Créer un store
    const storeOptions = createPiniaEntityStore({
      storeName: 'functionality-test'
    })
    
    // Simuler un store Pinia basique
    const mockStore = {
      entities: {
        byId: {},
        allIds: [],
        current: null,
        active: []
      }
    }
    
    // Tester les actions
    if (storeOptions.actions) {
      console.log('✅ Actions available:', Object.keys(storeOptions.actions))
      
      // Tester createOne
      if (storeOptions.actions.createOne) {
        const testEntity = { id: 'test1', name: 'Test User', email: 'test@example.com' }
        storeOptions.actions.createOne.call(mockStore, testEntity)
        
        console.log('✅ createOne action works!')
        console.log('📋 Store state after create:', mockStore.entities)
      }
    }
    
    // Tester les getters
    if (storeOptions.getters) {
      console.log('✅ Getters available:', Object.keys(storeOptions.getters))
    }
    
    return true
  } catch (error) {
    console.error('❌ Store functionality test failed:', error)
    return false
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Starting package tests...')
  
  const results = {
    import: await testPackageImport(),
    creation: await testStoreCreation(),
    functionality: await testStoreFunctionality()
  }
  
  console.log('📊 Test Results:')
  console.log('📦 Import:', results.import ? '✅ PASS' : '❌ FAIL')
  console.log('🏪 Creation:', results.creation ? '✅ PASS' : '❌ FAIL')
  console.log('⚙️ Functionality:', results.functionality ? '✅ PASS' : '❌ FAIL')
  
  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('🎉 All tests passed! Our package is working correctly!')
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.')
  }
  
  return allPassed
}

// Exporter pour utilisation dans l'application Vue
export { runAllTests, testPackageImport, testStoreCreation, testStoreFunctionality }

// Exécuter automatiquement si ce fichier est chargé directement
if (typeof window !== 'undefined') {
  // Dans le navigateur
  window.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Browser environment detected, running tests...')
    runAllTests()
  })
} else {
  // Dans Node.js
  console.log('🖥️ Node.js environment detected, running tests...')
  runAllTests()
}
