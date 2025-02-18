import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTimerForm, type TimerFormData } from './validation';
import { toast } from 'sonner';

// Mock the toast module
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('validateTimerForm', () => {
  // Helper function to create valid base data
  const createValidFormData = (): TimerFormData => ({
    title: 'Test Timer',
    description: 'Test Description',
    hours: 1,
    minutes: 30,
    seconds: 30,
  });

  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it('should return true for valid data', () => {
    const validData = createValidFormData();
    expect(validateTimerForm(validData)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should validate empty title', () => {
    const data = { ...createValidFormData(), title: '' };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('should validate title with only whitespace', () => {
    const data = { ...createValidFormData(), title: '   ' };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('should validate title length', () => {
    const data = { ...createValidFormData(), title: 'a'.repeat(51) };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Title must be less than 50 characters'
    );
  });

  it('should validate negative hours', () => {
    const data = { ...createValidFormData(), hours: -1 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should validate negative minutes', () => {
    const data = { ...createValidFormData(), minutes: -1 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should validate negative seconds', () => {
    const data = { ...createValidFormData(), seconds: -1 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should validate minutes greater than 59', () => {
    const data = { ...createValidFormData(), minutes: 60 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Minutes and seconds must be between 0 and 59'
    );
  });

  it('should validate seconds greater than 59', () => {
    const data = { ...createValidFormData(), seconds: 60 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Minutes and seconds must be between 0 and 59'
    );
  });

  it('should validate zero total time', () => {
    const data = { ...createValidFormData(), hours: 0, minutes: 0, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Please set a time greater than 0'
    );
  });

  it('should validate time exceeding 24 hours', () => {
    const data = { ...createValidFormData(), hours: 25 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
  });
});
