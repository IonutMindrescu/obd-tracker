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
import { use, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
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
import alertSound from '/alarm.wav'; // Make sure you have an audio file
import assistLogo from '/assist.png';
import carImage from '/opel-lung-crop.png';

function Dashboard() {
  // Tresholds
  const COOLANT_TEMP_TRESHOLD = 90;

  // Consts
  const [rpm, setRpm] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [coolant, setCoolant] = useState(null);
  const [intakeTemp, setIntakeTemp] = useState(null);
  const [engineLoad, setEnglineLoad] = useState(null);
  const [throttlePos, setThrottlePos] = useState(null);
  const [carVoltage, setCarVoltage] = useState(null);
  const [engineMAF, setEngineMAF] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const ws = useRef(null); // ✅ Add this
  const alertAudio = new Audio(alertSound);
  const hasAlerted = useState(false); // 🔁 Track alert state
  const [isCoolantAlert, setIsCoolantAlert] = useState(false);

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

  const ligtsMessage = async (message) => {
    notifications.show({
      //title: 'Success',
      message: message,
      icon: <Check style={{ width: rem(20), height: rem(20) }} />,
      color: 'green',
      radius: 'md',
      withBorder: true,
      autoClose: true,
    });
  };

  const sendMessage = (message) => {
    //console.log('Sending type:', typeof message, 'value:', message);

    ligtsMessage(`Ligts set to: ${message}`);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      console.log('Sent:', message);
    } else {
      console.warn('WebSocket is not open');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      ws.current = new WebSocket('wss://ws.sonny.ro');

      ws.current.onopen = () => {
        console.log('Connected to WebSocket');
        setWsConnected(true);
        ws.current.send(JSON.stringify({ type: 'subscribe', topic: 'all' })); // 👈 try sending something
      };

      ws.current.onmessage = async (event) => {
        try {
          let message = event.data;

          if (message instanceof Blob) {
            message = await message.text(); // Convert Blob to text
          }

          let data;
          try {
            data = JSON.parse(message); // Try to parse JSON
          } catch (err) {
            console.log('Received plain text message:', message);
            return; // Optionally handle it here if needed
          }

          console.log('Parsed data:', data);

          // Handle JSON data
          if (data.command === 'RPM') setRpm(data.value);
          if (data.command === 'SPEED') setSpeed(data.value);
          if (data.command === 'COOLANT_TEMP') {
            setCoolant(data.value);

            if (data.value > COOLANT_TEMP_TRESHOLD && !hasAlerted.current) {
              hasAlerted.current = true;
              setIsCoolantAlert(true);

              alertAudio
                .play()
                .catch((err) => console.warn('Audio play error:', err));

              notifications.show({
                title: 'High Coolant Temperature',
                message: `Coolant temp is ${data.value}°C`,
                icon: (
                  <AlertTriangle style={{ width: rem(20), height: rem(20) }} />
                ),
                color: 'red',
                radius: 'md',
                withBorder: true,
                autoClose: false,
              });
            }

            if (data.value <= COOLANT_TEMP_TRESHOLD && hasAlerted.current) {
              hasAlerted.current = false;
              setIsCoolantAlert(false);
            }
          }

          if (data.command === 'INTAKE_TEMP') setIntakeTemp(data.value);
          if (data.command === 'ENGINE_LOAD') setEnglineLoad(data.value);
          if (data.command === 'ELM_VOLTAGE') setCarVoltage(data.value);
          if (data.command === 'MAF') setEngineMAF(data.value);
          if (data.command === 'THROTTLE_POS') setThrottlePos(data.value);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error details:', event);
      };
      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setWsConnected(false);
      };

      return () => {
        if (ws.current) ws.current.close();
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant='outline'
              color='black'
              onClick={() => sendMessage('off')}
            >
              Turn Off
            </Button>

            <Button
              variant='outline'
              color='blue'
              onClick={() => sendMessage('police')}
            >
              Police Mode
            </Button>

            <Button
              variant='outline'
              color='red'
              onClick={() => sendMessage('pit')}
            >
              Pit Mode
            </Button>

            <Button
              variant='outline'
              color='orange'
              onClick={() => sendMessage('hazard')}
            >
              Hazard
            </Button>

            <Button
              variant='outline'
              color='yellow'
              onClick={() => sendMessage('chase')}
            >
              Chase Mode
            </Button>

            <Button
              variant='outline'
              color='green'
              onClick={() => sendMessage('acceleration')}
            >
              Acceleration Mode
            </Button>
          </div>
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
        <Card
          shadow='lg'
          padding='lg'
          radius='md'
          withBorder
          className={isCoolantAlert ? 'animate-pulse !bg-red-100' : ''}
        >
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
            value={carVoltage ? Math.min((carVoltage / 16) * 100, 100) : 0}
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
            {engineMAF !== null ? engineMAF.toFixed(2) : '--'} g/s
          </Text>
          <Progress
            value={engineMAF ? Math.min((engineMAF / 100) * 100, 100) : 0}
            size='xl'
            mt='sm'
            color='brown'
          />
        </Card>
      </div>
    </Container>
  );
}

export default Dashboard;
