export interface User {
  id: string
  name: string
  email: string
  age: number
  isActive: boolean
}

export interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

export interface Order {
  id: string
  userId: string
  productIds: number[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
}

// Fixtures pour les tests
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    isActive: true
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    isActive: false
  }
]

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: 2,
    name: 'Mouse',
    price: 29.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: 3,
    name: 'Keyboard',
    price: 79.99,
    category: 'Electronics',
    inStock: false
  }
]

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: '1',
    productIds: [1, 2],
    total: 1029.98,
    status: 'completed',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'order-2',
    userId: '2',
    productIds: [3],
    total: 79.99,
    status: 'pending',
    createdAt: new Date('2024-01-02')
  }
]

// Helpers pour créer des entités avec des IDs uniques
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: `user-${Date.now()}`,
    name: 'Test User',
    email: 'test@example.com',
    age: 25,
    isActive: true,
    ...overrides
  }
}

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: Date.now(),
    name: 'Test Product',
    price: 99.99,
    category: 'Test',
    inStock: true,
    ...overrides
  }
}

export function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: `order-${Date.now()}`,
    userId: '1',
    productIds: [1],
    total: 99.99,
    status: 'pending',
    createdAt: new Date(),
    ...overrides
  }
}
