import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the student list heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /student list/i });
  expect(headingElement).toBeInTheDocument();
});
