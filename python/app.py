import asyncio
import obd
import websockets
import json

# WebSocket server details
WS_SERVER_URI = "ws://ws.sonny.ro"  # Replace with your WebSocket server URL

# Connect to OBD-II over Bluetooth
def connect_obd():
    connection = None
    try:
        # Use `obd.OBD()` for automatic port detection
        # or specify Bluetooth port directly, e.g., "/dev/rfcomm0" or COM port in Windows
        connection = obd.OBD()  
        if connection.is_connected():
            print("Connected to OBD-II device!")
        else:
            print("Failed to connect to OBD-II device.")
    except Exception as e:
        print(f"Error connecting to OBD-II: {e}")
    return connection

# Read OBD-II data
async def read_obd_data(connection, websocket):
    while True:
        if not connection.is_connected():
            print("Lost connection to OBD-II device.")
            break
        
        # Example commands: RPM, Speed, Coolant Temperature
        data = {}
        for cmd in [obd.commands.RPM, obd.commands.SPEED, obd.commands.COOLANT_TEMP]:
            response = connection.query(cmd)
            if not response.is_null():
                data[cmd.name] = response.value.magnitude  # get the numeric value
        
        if data:
            # Send data as JSON to WebSocket server
            message = json.dumps(data)
            await websocket.send(message)
            print(f"Sent: {message}")

        await asyncio.sleep(1)  # wait 1 second before next reading

# Main async function
async def main():
    connection = connect_obd()
    if connection is None or not connection.is_connected():
        print("Unable to connect to OBD-II device. Exiting...")
        return

    async with websockets.connect(WS_SERVER_URI) as websocket:
        print("Connected to WebSocket server.")
        await read_obd_data(connection, websocket)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting program.")
