import { Container, Title } from '@mantine/core';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Container size='md' p='lg'>
      <Title align='center' mb='lg'>
        🚗 OBD2 Live Dashboard
      </Title>
      <Dashboard />
    </Container>
  );
}

export default App;
