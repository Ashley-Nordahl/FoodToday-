import { vi } from 'vitest'

// Mock user data
export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z'
}

// Mock auth context
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  signIn: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
  signUp: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null })
}

// Mock recipe data
export const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  description: 'A delicious test recipe',
  cuisine: 'Chinese',
  ingredients: ['ingredient-pork-chops', 'ingredient-garlic'],
  ingredientsWithAmounts: ['1 lb pork chops', '3 cloves garlic'],
  instructions: ['Cook the pork', 'Add garlic'],
  difficulty: 'Medium',
  cookTime: '30 minutes',
  emoji: '🥩'
}

// Mock favorites data
export const mockFavorites = [
  {
    id: 'fav-1',
    item_id: 1,
    item_type: 'recipe',
    user_id: mockUser.id,
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Mock stats data
export const mockStats = {
  total_recipes: 150,
  total_favorites: 25,
  total_searches: 300,
  user_id: mockUser.id
}

// Mock Supabase client functions
export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({ error: null })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        data: mockFavorites,
        error: null
      })
    }),
    insert: vi.fn().mockResolvedValue({
      data: [{ id: 'new-id' }],
      error: null
    }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    })
  })
}

// Mock the useAuth hook
export const mockUseAuth = vi.fn(() => mockAuthContext)

// Mock the trackSelection function
export const mockTrackSelection = vi.fn().mockResolvedValue({
  data: { id: 'tracking-123' },
  error: null
})

// Mock Supabase functions
export const mockGetAllStats = vi.fn().mockResolvedValue({
  data: mockStats,
  error: null
})

export const mockGetFavorites = vi.fn().mockResolvedValue({
  data: mockFavorites,
  error: null
})

export const mockGetRecipes = vi.fn().mockResolvedValue({
  data: [mockRecipe],
  error: null
})

export const mockAddToFavorites = vi.fn().mockResolvedValue({
  data: { id: 'new-fav' },
  error: null
})

export const mockRemoveFromFavorites = vi.fn().mockResolvedValue({
  data: [],
  error: null
})

// Setup all mocks
vi.mock('../lib/supabase', () => ({
  supabase: mockSupabaseClient
}))

vi.mock('../contexts/AuthContext', () => ({
  useAuth: mockUseAuth
}))

vi.mock('../lib/supabase', () => ({
  trackSelection: mockTrackSelection,
  getAllStats: mockGetAllStats,
  getFavorites: mockGetFavorites,
  getRecipes: mockGetRecipes,
  addToFavorites: mockAddToFavorites,
  removeFromFavorites: mockRemoveFromFavorites
}))
