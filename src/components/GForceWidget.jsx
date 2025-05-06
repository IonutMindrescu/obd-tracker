import { Badge, Card, Group, Text } from '@mantine/core';
import {
  ArrowDown,
  ArrowLeft,
  ArrowNarrowDown,
  ArrowNarrowUp,
  ArrowRight,
  ArrowUp,
} from 'tabler-icons-react';

export default function GForceWidget({ gForce = { x: 1, y: 0.4, z: -1.3 } }) {
  const { x, y, z } = gForce;

  const getDirectionIcon = (value, PositiveIcon, NegativeIcon) => {
    if (value > 0.1)
      return <PositiveIcon className='text-green-600' size={20} />;
    if (value < -0.1)
      return <NegativeIcon className='text-red-600' size={20} />;
    return null;
  };

  return (
    <Card shadow='md' padding='lg' radius='md'>
      <Text size='xl' fw={600} ta='center' className='mb-4'>
        G-Force Monitor
      </Text>

      <Group justify='space-between' className='mb-2'>
        <Text c='gray'>X-axis</Text>
        <Group>
          {getDirectionIcon(x, ArrowRight, ArrowLeft)}
          <Badge color='blue' variant='filled'>
            {x.toFixed(2)} G
          </Badge>
        </Group>
      </Group>

      <Group justify='space-between' className='mb-2'>
        <Text c='gray'>Y-axis</Text>
        <Group>
          {getDirectionIcon(y, ArrowUp, ArrowDown)}
          <Badge color='blue' variant='filled'>
            {y.toFixed(2)} G
          </Badge>
        </Group>
      </Group>

      <Group justify='space-between'>
        <Text c='gray'>Z-axis</Text>
        <Group>
          {getDirectionIcon(z, ArrowNarrowUp, ArrowNarrowDown)}
          <Badge color='blue' variant='filled'>
            {z.toFixed(2)} G
          </Badge>
        </Group>
      </Group>
    </Card>
  );
}
