import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalButtons } from '../ModalButton';

describe('ModalButtons', () => {
  it('renders cancel and submit buttons with correct text', () => {
    const onCancel = vi.fn();
    render(<ModalButtons onCancel={onCancel} submitText="Save Changes" />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save Changes' })
    ).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ModalButtons onCancel={onCancel} submitText="Submit" />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles when isValid is false', () => {
    const onCancel = vi.fn();
    render(
      <ModalButtons onCancel={onCancel} submitText="Submit" isValid={false} />
    );

    const submitButton = screen.getByText('Submit');
    expect(submitButton.className).toContain('bg-blue-400');
    expect(submitButton.className).toContain('cursor-not-allowed');
    expect(submitButton.className).not.toContain('hover:bg-blue-700');
  });

  it('applies correct styles when isValid is true', () => {
    const onCancel = vi.fn();
    render(
      <ModalButtons onCancel={onCancel} submitText="Submit" isValid={true} />
    );

    const submitButton = screen.getByText('Submit');
    expect(submitButton.className).toContain('bg-blue-600');
    expect(submitButton.className).toContain('hover:bg-blue-700');
    expect(submitButton.className).not.toContain('bg-blue-400');
    expect(submitButton.className).not.toContain('cursor-not-allowed');
  });
});
