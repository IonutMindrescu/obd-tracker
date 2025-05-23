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
  rem,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { use, useEffect, useState } from 'react';
import {
  ArrowsMaximize,
  BatteryAutomotive,
  BrandStripe,
  Car,
  Check,
  Engine,
  Filter,
  Gauge,
  Lamp2,
  Thermometer,
} from 'tabler-icons-react';
import GForceWidget from './GForceWidget';
import MapComponent from './MapComponent'; // Import MapComponent into App.jsx
import assistLogo from '/assist.png';
import carImage from '/opel-lung-crop.png';

function Dashboard() {
  const [rpm, setRpm] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [coolant, setCoolant] = useState(null);
  const [intakeTemp, setIntakeTemp] = useState(null);
  const [engineLoad, setEnglineLoad] = useState(null);
  const [throttlePos, setThrottlePos] = useState(null);
  const [carVoltage, setCarVoltage] = useState(null);
  const [engineMAF, setEngineMAF] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const fullscreen = () => {
    const elem = document.documentElement; // Fullscreen the whole page
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      // Safari
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE11
      elem.msRequestFullscreen();
    }
  };

  const handleLights = async () => {
    notifications.show({
      title: 'Success',
      message: 'Exterior Lights turned on!',
      icon: <Check style={{ width: rem(20), height: rem(20) }} />,
      color: 'green',
      radius: 'md',
      withBorder: true,
      autoClose: true,
    });
  };

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
          if (data.INTAKE_TEMP !== undefined) setIntakeTemp(data.INTAKE_TEMP);
          if (data.ENGINE_LOAD !== undefined) setEnglineLoad(data.ENGINE_LOAD);
          if (data.ELM_VOLTAGE !== undefined) setCarVoltage(data.ELM_VOLTAGE);
          if (data.MAF !== undefined) setEngineMAF(data.MAF);
          if (data.THROTTLE_POS !== undefined)
            setThrottlePos(data.THROTTLE_POS);
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
      <div className='pt-2 pb-3'>
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            {/* Car image */}
            <img
              src={carImage}
              className='w-40 md:w-48 object-cover'
              alt='Car Image'
            />

            {/* Center title */}
            <div className='flex-1 text-center md:text-left'>
              <p className='text-[20pt] font-bold'>🏁 GTA Bucovina</p>
            </div>

            {/* Assist logo */}
            <img
              src={assistLogo}
              className='w-32 md:w-48 object-cover'
              alt='Assist Logo'
            />

            {/* Fullscreen button */}
            <Button variant='light' color='blue' onClick={fullscreen}>
              <ArrowsMaximize size={24} />
            </Button>
          </div>
        </Card>
      </div>

      <div className='pb-3'>
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Button
            rightSection={<Lamp2 size={14} />}
            variant='outline'
            onClick={() => handleLights()}
          >
            Toggle Lights
          </Button>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* G-Force Widget */}
        <GForceWidget />

        {/* RPM Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Gauge size={40} color='green' />
            <Text size='lg' color='green' className='font-bold'>
              RPM
            </Text>
          </Group>
          <Text
            align='center'
            size='xl'
            weight={700}
            color='green'
            className='font-bold'
          >
            {rpm !== null ? rpm : '--'} RPM
          </Text>
          <Progress
            value={rpm ? Math.min((rpm / 7000) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='green'
            label={`${Math.min((rpm / 7000) * 100, 100).toFixed(0)}%`}
          />
        </Card>

        {/* Throttle Position Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Thermometer size={40} color='purple' />
            <Text size='lg' color='purple'>
              Throttle Position
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='purple'>
            {throttlePos !== null ? throttlePos.toFixed(2) : '--'} %
          </Text>
          <Progress
            value={throttlePos ? Math.min((throttlePos / 60) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='purple'
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

        {/* Intake Temp Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Thermometer size={40} color='orange' />
            <Text size='lg' color='orange'>
              Intake Temp
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='orange'>
            {intakeTemp !== null ? intakeTemp.toFixed(2) : '--'} °C
          </Text>
          <Progress
            value={intakeTemp ? Math.min((intakeTemp / 60) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='orange'
          />
        </Card>

        {/* Engine Load Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Engine size={40} color='black' />
            <Text size='lg' color='black'>
              Engine Load
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='black'>
            {engineLoad !== null ? engineLoad.toFixed(2) : '--'} %
          </Text>
          <Progress
            value={engineLoad ? Math.min((engineLoad / 100) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='black'
          />
        </Card>

        {/* Battery Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <BatteryAutomotive size={40} color='green' />
            <Text size='lg' color='green'>
              Voltage
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='black'>
            {carVoltage !== null ? carVoltage : '--'} V
          </Text>
          <Progress
            value={carVoltage ? Math.min((carVoltage / 100) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='green'
          />
        </Card>

        {/* MAF Card */}
        <Card shadow='lg' padding='lg' radius='md' withBorder>
          <Group position='center' mb='sm'>
            <Filter size={40} color='brown' />
            <Text size='lg' color='brown'>
              MAF
            </Text>
          </Group>
          <Text align='center' size='xl' weight={700} color='black'>
            {engineMAF !== null ? engineMAF : '--'} g/s
          </Text>
          <Progress
            value={engineMAF ? Math.min((engineMAF / 100) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='brown'
          />
        </Card>
      </div>

      <Grid mt='xl' gutter='lg'>
        <Grid.Col span={12}>
          <Card shadow='lg' padding='lg' radius='md' withBorder>
            <MapComponent />

            {/* <Group position='center' mb='sm'>
              <Badge color='blue' variant='filled' size='lg'>
                Real-time Data
              </Badge>
            </Group>
            <Alert variant='outline' color='yellow' radius='lg'>
              Data is being updated every second directly from your OBD-II
              device. Keep your car engine running to get live updates!
            </Alert> */}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Dashboard;
