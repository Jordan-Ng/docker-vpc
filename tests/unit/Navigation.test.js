import { render, screen, waitFor , fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';

beforeAll(() => {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

  global.window.electron = {
    runCommand: jest.fn(() =>
      Promise.resolve({
        exitStatus: 0,
        out: '[]'
      })
    ),
    eventBridge: {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    },
  };
});

test('renders EC2 dashboard and instance table by default', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByTestId('appshell-burger'))
  fireEvent.click(screen.getByTestId('Volumes'))

  await waitFor(() =>
    expect(screen.getByTestId('ec2-volumes')).toBeInTheDocument()
  );
});
