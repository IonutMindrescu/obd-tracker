import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Car, Gauge, Thermometer } from 'tabler-icons-react';

function Dashboard() {
  const [rpm, setRpm] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [coolant, setCoolant] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const ws = new WebSocket('wss://ws.sonny.ro');
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setWsConnected(true);
        ws.send(JSON.stringify({ type: 'subscribe', topic: 'all' })); // 👈 try sending something
      };

      ws.onmessage = async (event) => {
        try {
          let message = event.data;

          if (message instanceof Blob) {
            message = await message.text(); // 👈 Convert Blob to text
          }

          const data = JSON.parse(message); // 👈 Parse JSON
          console.log('Parsed data:', data);

          // Now you can use data.RPM, data.SPEED, etc
          if (data.RPM !== undefined) setRpm(data.RPM);
          if (data.SPEED !== undefined) setSpeed(data.SPEED);
          if (data.COOLANT_TEMP !== undefined) setCoolant(data.COOLANT_TEMP);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error details:', event);
      };
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setWsConnected(false);
      };

      return () => {
        ws.close();
      };
    }, 1000); // Add a 1-second delay

    return () => clearTimeout(timeoutId);
  }, []);

  if (!wsConnected) {
    return (
      <Container size='md' p='lg' style={{ textAlign: 'center' }}>
        <Title order={2} mb='lg'>
          Connecting to OBD...
        </Title>
        <Text size='lg'>
          Please ensure your OBD device is connected and the WebSocket server is
          running.
        </Text>
        <Button
          variant='outline'
          color='blue'
          mt='md'
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </Button>
      </Container>
    );
  }

  return (
    <Container size='xl'>
      <SimpleGrid cols={1} spacing='lg' className='py-5'>
        {/* RPM Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <div className='flex items-center gap-8'>
            <img
              src='/public/opel-lung-crop.png'
              className='w-48 object-cover'
              alt='Car Image'
            />
            <div className='flex-1 flex items-center'>
              <p className='text-xl font-bold'>
                🏁 GTA Bucovina - Opel Dashboard
              </p>
            </div>
          </div>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={3} spacing='lg'>
        {/* RPM Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Gauge size={40} color='green' />
            <Text size='lg' color='green'>
              RPM
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='green'>
            {rpm !== null ? rpm : '--'} RPM
          </Text>
          <Progress
            value={rpm ? Math.min((rpm / 7000) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='green'
            label={`${Math.min((rpm / 7000) * 100, 100).toFixed(0)}%`} // Display the percentage as a label
          />
        </Card>

        {/* Speed Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Car size={40} color='blue' />
            <Text size='lg' color='blue'>
              Speed
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='blue'>
            {speed !== null ? speed : '--'} km/h
          </Text>
          <Progress
            value={speed ? Math.min((speed / 200) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='blue'
          />
        </Card>

        {/* Coolant Temp Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Thermometer size={40} color='red' />
            <Text size='lg' color='red'>
              Coolant Temp
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='red'>
            {coolant !== null ? coolant : '--'} °C
          </Text>
          <Progress
            value={coolant ? Math.min((coolant / 120) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='red'
          />
        </Card>
      </SimpleGrid>

      <Grid mt='xl' gutter='lg'>
        <Grid.Col span={12}>
          <Card shadow='lg' padding='lg' radius='md' withBorder>
            <Group position='center' mb='sm'>
              <Badge color='blue' variant='filled' size='lg'>
                Real-time Data
              </Badge>
            </Group>
            <Alert
              variant='outline'
              color='yellow'
              radius='lg'
              title='Alert title'
            >
              Data is being updated every second directly from your OBD-II
              device. Keep your car engine running to get live updates!
            </Alert>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Dashboard;
