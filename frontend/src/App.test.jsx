import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('Carbon Footprint App', () => {
  it('renders the initial Transport step', () => {
    render(<App />);
    expect(screen.getByText('EcoScore')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText(/How many miles do you drive/i)).toBeInTheDocument();
  });

  it('navigates through the form steps', () => {
    render(<App />);
    
    // Step 1 -> 2
    const nextButton = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('Diet')).toBeInTheDocument();
    
    // Step 2 -> 3
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    expect(screen.getByText('Energy')).toBeInTheDocument();
    
    // Step 3 -> 2
    const backButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(backButton);
    expect(screen.getByText('Diet')).toBeInTheDocument();
  });

  it('triggers loading state on submit', async () => {
    render(<App />);
    
    // Go to step 3
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    
    // Mock fetch to prevent actual network request
    global.fetch = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    const calculateButton = screen.getByRole('button', { name: /calculate footprint/i });
    fireEvent.click(calculateButton);
    
    // Verify loading state
    expect(await screen.findByText(/Analyzing footprint/i)).toBeInTheDocument();
  });
});
