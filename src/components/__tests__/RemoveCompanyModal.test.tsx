import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RemoveCompanyModal } from '../RemoveCompanyModal'
import { Company } from '../../types'

describe('RemoveCompanyModal', () => {
  const mockCompany: Company = {
    id: 1,
    name: 'OpenAI',
    industry: 'AI/ML',
    stage: 'Late Stage',
    matchScore: 95,
    logo: 'https://logo.clearbit.com/openai.com',
    careerUrl: 'https://openai.com/careers',
    location: 'San Francisco, CA',
    employees: '~1500',
    remote: 'In-office',
    openRoles: 3,
    matchReasons: ['Strong AI safety focus', 'High velocity culture'],
    connections: [2],
    connectionTypes: { '2': 'AI Competitor' },
    color: '#10B981',
    angle: 0,
    distance: 75
  }

  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(
      <RemoveCompanyModal
        isOpen={false}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByRole('heading', { name: 'Remove Company' })).not.toBeInTheDocument()
  })

  it('should not render when company is null', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={null}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByRole('heading', { name: 'Remove Company' })).not.toBeInTheDocument()
  })

  it('should render modal with company information when open', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('heading', { name: 'Remove Company' })).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
    expect(screen.getByText('Industry:')).toBeInTheDocument()
    expect(screen.getByText('AI/ML')).toBeInTheDocument()
    expect(screen.getByText('Stage:')).toBeInTheDocument()
    expect(screen.getByText('Late Stage')).toBeInTheDocument()
    expect(screen.getByText('Match Score:')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('should call onConfirm when Remove Company button is clicked', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const removeButton = screen.getByRole('button', { name: 'Remove Company' })
    fireEvent.click(removeButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('should call onCancel when X button is clicked', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    // Find the close button by its className (the X button)
    const closeButton = document.querySelector('.text-gray-400.hover\\:text-gray-600')
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton as Element)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('should display the removal effects information', () => {
    render(
      <RemoveCompanyModal
        isOpen={true}
        company={mockCompany}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('This will:')).toBeInTheDocument()
    expect(screen.getByText('Hide the company from your exploration graph')).toBeInTheDocument()
    expect(screen.getByText('Remove it from your watchlist (if saved)')).toBeInTheDocument()
    expect(screen.getByText('Hide related connections in the visualization')).toBeInTheDocument()
  })
});