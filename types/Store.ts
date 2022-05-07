export interface BaseStoreEntity {
  readonly id: number
  readonly createdAt: Date
  readonly updatedAt: Date
}
export interface UserEntity extends BaseStoreEntity {
  email: string
  token: string
  firstName: string
  lastName: string
  companyName: string
}

