import { render, screen } from '@testing-library/react';
import App from './App';

test('renders New Search link', () => {
  render(<App />);
  const linkElement = screen.getByText(/New Search/i);
  expect(linkElement).toBeInTheDocument();
});
