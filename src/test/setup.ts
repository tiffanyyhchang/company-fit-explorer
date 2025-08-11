import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.open for testing
Object.defineProperty(window, 'open', {
  writable: true,
  value: vi.fn(),
})

// Mock Cytoscape for component tests
vi.mock('cytoscape', () => {
  const mockNodes = {
    removeClass: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    connectedEdges: vi.fn().mockReturnValue({
      connectedNodes: vi.fn().mockReturnValue({
        filter: vi.fn().mockReturnThis(),
        removeClass: vi.fn().mockReturnThis(),
      })
    }),
    length: 1,
  }

  const mockEdges = {
    removeClass: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    length: 1,
  }

  const mockElement = {
    removeClass: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    connectedEdges: vi.fn().mockReturnValue({
      connectedNodes: vi.fn().mockReturnValue(mockNodes)
    }),
    data: vi.fn().mockReturnValue({}),
    source: vi.fn().mockReturnValue({ id: vi.fn().mockReturnValue('source-1') }),
    target: vi.fn().mockReturnValue({ id: vi.fn().mockReturnValue('target-1') }),
    id: vi.fn().mockReturnValue('element-1'),
  }

  return {
    default: vi.fn(() => ({
      nodes: vi.fn(() => mockNodes),
      edges: vi.fn(() => mockEdges),
      on: vi.fn(),
      getElementById: vi.fn().mockReturnValue(mockElement),
      fit: vi.fn(),
      zoom: vi.fn().mockReturnValue(1),
      destroy: vi.fn(),
      // Mock the core cytoscape instance for background clicks
      target: undefined,
    })),
  }
})