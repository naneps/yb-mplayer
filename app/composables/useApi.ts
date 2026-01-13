export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

export const useApi = () => {
  const request = async <T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    return await $fetch<T>(url, {
      method: options.method ?? 'GET',
      query: options.query,
      body: options.body,
      headers: options.headers
    } ) as T
  }

  return { request }
}
