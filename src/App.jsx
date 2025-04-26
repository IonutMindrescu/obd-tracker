import { Container, MantineProvider, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className='bg-gray-800 text-white'>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
          colors: {
            // override dark colors here to change them for all components
            dark: [
              '#d5d7e0',
              '#acaebf',
              '#8c8fa3',
              '#666980',
              '#4d4f66',
              '#34354a',
              '#2b2c3d',
              '#1d1e30',
              '#0c0d21',
              '#01010a',
            ],
          },
        }}
      >
        <Dashboard />
      </MantineProvider>
    </div>
  );
}

export default App;
