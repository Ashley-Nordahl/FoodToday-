import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import i18n from '../i18n'
import { mockAuthContext } from '../mocks/supabase'

// Mock AuthContext provider
const MockAuthProvider = ({ children, user = mockAuthContext.user }) => {
  return (
    <div data-testid="auth-provider">
      {children}
    </div>
  )
}

// Render component with all necessary providers
export const renderWithProviders = (
  ui,
  {
    user = mockAuthContext.user,
    locale = 'en',
    route = '/',
    ...renderOptions
  } = {}
) => {
  // Set i18n locale
  i18n.changeLanguage(locale)

  // Mock window.location for routing tests
  Object.defineProperty(window, 'location', {
    value: {
      pathname: route,
      search: '',
      hash: '',
      href: route,
    },
    writable: true,
  })

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <MockAuthProvider user={user}>
          {children}
        </MockAuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock recipe data generator
export const mockRecipeData = (overrides = {}) => ({
  id: 1,
  name: 'Test Recipe',
  description: 'A delicious test recipe',
  cuisine: 'Chinese',
  ingredients: ['ingredient-pork-chops', 'ingredient-garlic'],
  ingredientsWithAmounts: ['1 lb pork chops', '3 cloves garlic'],
  instructions: ['Cook the pork', 'Add garlic'],
  difficulty: 'Medium',
  cookTime: '30 minutes',
  emoji: '🥩',
  ...overrides
})

// Mock cuisine data
export const mockCuisineData = (overrides = {}) => ({
  name: 'Chinese',
  emoji: '🍚',
  flag: '🇨🇳',
  color: '#2ECC71',
  ...overrides
})

// Mock ingredient data
export const mockIngredientData = (overrides = {}) => ({
  id: 'ingredient-pork-chops',
  name: 'Pork Chops',
  emoji: '🥩',
  category: 'Meat',
  subcategory: 'Pork',
  ...overrides
})

// Mock party data
export const mockPartyData = (overrides = {}) => ({
  id: 401,
  name: 'Birthday Celebration',
  description: 'Make your special day unforgettable',
  emoji: '🎂',
  category: 'Birthday',
  price: '$299',
  duration: '4 hours',
  ...overrides
})

// Wait for async operations to complete
export const waitForRecipeLoad = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Mock user interactions
export const mockUserEvent = {
  click: async (element) => {
    element.click()
    await waitForRecipeLoad()
  },
  type: async (element, text) => {
    element.value = text
    element.dispatchEvent(new Event('input', { bubbles: true }))
    await waitForRecipeLoad()
  },
  select: async (element, value) => {
    element.value = value
    element.dispatchEvent(new Event('change', { bubbles: true }))
    await waitForRecipeLoad()
  }
}

// Mock drag and drop
export const mockDragAndDrop = {
  dragStart: (element, data) => {
    const event = new Event('dragstart', { bubbles: true })
    event.dataTransfer = {
      effectAllowed: 'move',
      setData: () => {},
      getData: () => data
    }
    element.dispatchEvent(event)
  },
  dragOver: (element) => {
    const event = new Event('dragover', { bubbles: true })
    event.preventDefault = () => {}
    element.dispatchEvent(event)
  },
  drop: (element, data) => {
    const event = new Event('drop', { bubbles: true })
    event.dataTransfer = {
      effectAllowed: 'move',
      setData: () => {},
      getData: () => data
    }
    element.dispatchEvent(event)
  }
}

// Mock scroll behavior
export const mockScrollTo = (position) => {
  window.scrollTo = vi.fn()
  window.scrollTo.mockImplementation((options) => {
    if (typeof options === 'object') {
      window.pageYOffset = options.top || 0
    } else {
      window.pageYOffset = position || 0
    }
  })
}

// Mock getBoundingClientRect
export const mockGetBoundingClientRect = (element, rect) => {
  element.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    ...rect
  })
}
