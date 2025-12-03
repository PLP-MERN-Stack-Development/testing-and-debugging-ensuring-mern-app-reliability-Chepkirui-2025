// Form.test.jsx - Unit tests for Form component

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Form from '../../../components/Form';

describe('Form Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form with all fields', () => {
    render(<Form onSubmit={mockOnSubmit} />);
    
    expect (screen.getByLabelText(/email/i)).toBeInTheDocument();
expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});
it('validates email format', async () => {
render(<Form onSubmit={mockOnSubmit} />);
const user = userEvent.setup();
const emailInput = screen.getByLabelText(/email/i);
await user.type(emailInput, 'invalid-email');

const submitButton = screen.getByRole('button', { name: /submit/i });
await user.click(submitButton);

await waitFor(() => {
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});

expect(mockOnSubmit).not.toHaveBeenCalled();
});
it('validates password length', async () => {
render(<Form onSubmit={mockOnSubmit} />);
const user = userEvent.setup();
const passwordInput = screen.getByLabelText(/password/i);
await user.type(passwordInput, 'short');

const submitButton = screen.getByRole('button', { name: /submit/i });
await user.click(submitButton);

await waitFor(() => {
  expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
});

expect(mockOnSubmit).not.toHaveBeenCalled();
});
it('submits form with valid data', async () => {
render(<Form onSubmit={mockOnSubmit} />);
const user = userEvent.setup();
const emailInput = screen.getByLabelText(/email/i);
const passwordInput = screen.getByLabelText(/password/i);

await user.type(emailInput, 'test@example.com');
await user.type(passwordInput, 'Password123!');

const submitButton = screen.getByRole('button', { name: /submit/i });
await user.click(submitButton);

await waitFor(() => {
  expect(mockOnSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'Password123!',
  });
});
});
it('disables submit button during submission', async () => {
const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
render(<Form onSubmit={slowSubmit} />);
const user = userEvent.setup();
const emailInput = screen.getByLabelText(/email/i);
const passwordInput = screen.getByLabelText(/password/i);
const submitButton = screen.getByRole('button', { name: /submit/i });

await user.type(emailInput, 'test@example.com');
await user.type(passwordInput, 'Password123!');
await user.click(submitButton);

expect(submitButton).toBeDisabled();
});
it('displays server errors', async () => {
const errorMessage = 'Server error occurred';
render(<Form onSubmit={mockOnSubmit} error={errorMessage} />);
expect(screen.getByText(errorMessage)).toBeInTheDocument();
});
it('clears errors on input change', async () => {
const { rerender } = render(<Form onSubmit={mockOnSubmit} error="Error message" />);
const user = userEvent.setup();
expect(screen.getByText('Error message')).toBeInTheDocument();

const emailInput = screen.getByLabelText(/email/i);
await user.type(emailInput, 'test@example.com');

rerender(<Form onSubmit={mockOnSubmit} error="" />);

expect(screen.queryByText('Error message')).not.toBeInTheDocument();
});
});