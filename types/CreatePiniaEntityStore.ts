export interface CreationOptions {
  getters?: any
  actions?: any
  defaultState?: Record<string, any>
}

export interface CreationParams {
  options?: CreationOptions
  id: string
}
