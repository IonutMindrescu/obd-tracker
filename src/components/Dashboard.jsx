import {
  Badge,
  Box,
  Card,
  Container,
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
      ws.binaryType = 'text'; // 👈 Add this line
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
      </Container>
    );
  }

  return (
    <Container size='lg' p='lg'>
      <Title order={2} align='center' mb='xl'>
        🚗 Live OBD Data
      </Title>

      <SimpleGrid cols={3} spacing='lg'>
        {/* RPM Card */}
        <Card shadow='md' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Gauge size={40} />
            <Text size='lg'>RPM</Text>
          </Group>
          <Text align='center' size='xl' weight={700}>
            {rpm !== null ? rpm : '--'} RPM
          </Text>
          <Progress
            value={rpm ? Math.min(rpm / 7000, 100) : 0}
            size='xl'
            mt='sm'
          />
        </Card>

        {/* Speed Card */}
        <Card shadow='md' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Car size={40} />
            <Text size='lg'>Speed</Text>
          </Group>
          <Text align='center' size='xl' weight={700}>
            {speed !== null ? speed : '--'} km/h
          </Text>
          <Progress
            value={speed ? Math.min(speed / 200, 100) : 0}
            size='xl'
            mt='sm'
          />
        </Card>

        {/* Coolant Temp Card */}
        <Card shadow='md' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Thermometer size={40} />
            <Text size='lg'>Coolant Temp</Text>
          </Group>
          <Text align='center' size='xl' weight={700}>
            {coolant !== null ? coolant : '--'} °C
          </Text>
          <Progress
            value={coolant ? Math.min(coolant / 120, 100) : 0}
            size='xl'
            mt='sm'
          />
        </Card>
      </SimpleGrid>

      <Grid mt='xl' gutter='lg'>
        <Grid.Col span={12}>
          <Card shadow='md' padding='lg' radius='md' withBorder>
            <Group position='center' mb='sm'>
              <Badge color='blue' variant='filled' size='lg'>
                Real-time Data
              </Badge>
            </Group>
            <Text align='center' size='md' color='dimmed'>
              Data is being updated every second directly from your OBD-II
              device. Keep your car engine running to get live updates!
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Dashboard;
