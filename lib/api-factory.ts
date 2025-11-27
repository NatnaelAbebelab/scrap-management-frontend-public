/**
 * APIFactory - A centralized factory for making API calls
 *
 * This factory provides methods for making API calls to different endpoints.
 * It centralizes the API URL configuration, making it easy to update endpoints.
 */

import { GetRatesResponse } from "./types/rate-api"
import { GetPurchaseResponse } from "./types/purchase-api"

// Define the base URL for the API
export const BASE_URL = "http://127.0.0.1:7000"

const API_BASE_URL = "http://127.0.0.1:7000/api/v1"
// Define types for API responses
interface ApiResponse<T> {
  data?: T
  results?: T
  error?: string
  status: number
}

// Define common headers
const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status

  try {
    // Try to parse the response as JSON
    const data = await response.json()

    if (response.ok) {
      return { data: data as T, status }
    } else {
      return { error: data.message || "An error occurred", status }
    }
  } catch (error) {
    // If the response is not JSON, or if there's an error parsing it
    return {
      error: response.ok ? "No content" : "An error occurred",
      status,
    }
  }
}

// The API factory object
const APIFactory = {
  // Authentication endpoints
  auth: {
    login: async (email: string, password: string): Promise<ApiResponse<{ logged_user: string, tokens: { access: string, refresh: string }, role: string }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/login/`, {
          method: 'POST',
          headers: getDefaultHeaders(),
          body: JSON.stringify({ email, password }),
        })
    
        return handleResponse<{ logged_user: string, tokens: { access: string, refresh: string }, role: string }>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
    
    logout: async (token: string): Promise<ApiResponse<void>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/logout/`, {
          method: 'POST',
          credentials: "include",
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<void>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
    
    validateToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/api/token/verify/`, {
          method: 'POST',
          headers: getDefaultHeaders(token),
          body: JSON.stringify({ token }),
        })
        
        if (response.ok) {
          return { data: { valid: true }, status: response.status };
        }
    
        return { data: { valid: false }, status: response.status };
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    refreshToken: async (refreshToken: string): Promise<ApiResponse<{ access: string, refresh: string }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/api/token/refresh/`, {
          method: 'POST',
          headers: getDefaultHeaders(),
          body: JSON.stringify({ refresh: refreshToken }),
        })
        return handleResponse<{ access: string, refresh: string }>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
  },
  
  // Purchase endpoints
  purchase: {
    getRates: async (token: string, params?: Record<string, string>): Promise<ApiResponse<GetRatesResponse>> => {
      try {
        // Build query string from params
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
        
        const response = await fetch(`${API_BASE_URL}/rate/archive${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<GetRatesResponse>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    addRate: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/rate/add/`, {
          method: 'POST',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    updateRate: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/rate/add/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    deleteRate: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/rate/delete/`, {
          method: 'DELETE',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
    
    uploadData: async (token: string, formData: FormData): Promise<ApiResponse<{ success: boolean, skipped_records: {"invalid_records_no":[], "invalid_firm": [], "invalid_material_type": []}, total_records: string}>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/upload/`, {
          method: 'POST',
          headers,
          body: formData,
        })
        return handleResponse<{ success: boolean, skipped_records: {"invalid_records_no":[], "invalid_firm": [], "invalid_material_type": []}, total_records: string}>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    getRecords: async (token: string, params?: Record<string, string>): Promise<ApiResponse<GetPurchaseResponse>> => {
      try {
        // Build query string from params
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
        
        const response = await fetch(`${API_BASE_URL}/grn/grn${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<GetPurchaseResponse>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    changePurchaseStatus: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/change-status-individual/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    bulkChangePurchaseStatus: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/change-status-bulk/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    approvePurchase: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/approve-grn-supervisor/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    declinePurchase: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/decline-grn/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    declinePurchaseBySupervisor: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/decline-grn-supervisor/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    deletePurchase: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/delete-grn/`, {
          method: 'DELETE',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    payCustomer: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/pay-customer/`, {
          method: 'POST',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    addWasteDeduction: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/add-waste/`, {
          method: 'POST',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    editWasteDeduction: async (token: string, formData: FormData): Promise<ApiResponse<any[]>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/grn/edit-waste/`, {
          method: 'PATCH',
          headers,
          body: formData,
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    plainReport: async (token: string, params?: Record<string, string>): Promise<ApiResponse<ApiResponse<any>>> => {
      try {
        // Build query string from params
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
        
        const response = await fetch(`${API_BASE_URL}/report/plain-report${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<any>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },

    aggregateReport: async (token: string, params?: Record<string, any>): Promise<ApiResponse<any>> => {
      try {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''

        const response = await fetch(`${API_BASE_URL}/report/aggregate-report${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<any>(response)
      } catch (error) {
        console.log(error)
        return { error: 'Network error', status: 0 }
      }
    },

    dailyPerformanceReport: async (token: string, params: Record<string, any>): Promise<ApiResponse<any>> => {
      try {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''

        const response = await fetch(`${API_BASE_URL}/grn/get-daily-purchase-performance${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<any>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
  },
  
  // Internal transport endpoints
  internal: {
    getRecords: async (token: string, params?: Record<string, string>): Promise<ApiResponse<any[]>> => {
      try {
        // Build query string from params
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
        
        const response = await fetch(`${API_BASE_URL}/internal/records${queryString}`, {
          method: 'GET',
          headers: getDefaultHeaders(token),
        })
        
        return handleResponse<any[]>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
    
    uploadData: async (token: string, formData: FormData): Promise<ApiResponse<{ success: boolean }>> => {
      try {
        // Note: We're not using getDefaultHeaders here because we're sending FormData
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically with the boundary
        }
        
        const response = await fetch(`${API_BASE_URL}/internal/upload`, {
          method: 'POST',
          headers,
          body: formData,
        })
        
        return handleResponse<{ success: boolean }>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
    
    generateReport: async (token: string, params: Record<string, any>): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/internal/reports`, {
          method: 'POST',
          headers: getDefaultHeaders(token),
          body: JSON.stringify(params),
        })
        
        return handleResponse<any>(response)
      } catch (error) {
        return { error: 'Network error', status: 0 }
      }
    },
  },
  
  // Generic request method for custom endpoints
  request: async <T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    token?: string,
    data?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const options: RequestInit = {
        method,
        headers: getDefaultHeaders(token),
      }
      
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data)
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
      
      return handleResponse<T>(response)
    }
    catch (error)
    {
      return { error: 'Network error', status: 0 }
    }
  },
}

export default APIFactory
