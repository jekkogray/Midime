import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebMidi } from 'webmidi';
import NoteDisplay from './components/NoteDisplay';
import RotaryEncoderIndicator from './components/RotaryEncoderIndicator';
import PitchBendDisplay from './components/PitchBendDisplay';

export default function App() {
	const [isReady, setIsReady] = useState(false);
	const [devices, setDevices] = useState([]);

	const [currentPitchBendValue, setCurrentPitchBendValue] = useState(0.5); // MIDI note value state
	const [currentNoteValue, setCurrentNoteValue] = useState(""); // MIDI note value state
	const [rotaryValues, setRotaryValues] = useState([0.0,0.0,0.0,0.0]); // Rotary encoder value state

  const [selectedDevice, setSelectedDevice] = useState(null);

	useEffect(() => {
		WebMidi.enable()
			.then(() => {
				updateDevices();
				WebMidi.addListener("connected", updateDevices);
				WebMidi.addListener("disconnected", updateDevices);

        // Unmount
				return () => {
					WebMidi.removeListener("connected", updateDevices);
					WebMidi.removeListener("disconnected", updateDevices);
				};
			})
			.catch((err) => alert(err));
	}, []);

	const updateDevices = () => {
		setDevices(WebMidi.inputs);
		setIsReady(WebMidi.inputs.length > 0);
	};

	const startListeningToDevice = (input) => {
		setSelectedDevice(input);
		input.addListener("noteon", "all", (e) => {
			console.log(`Note on: ${e.note.name}${e.note.octave}`);
			setCurrentNoteValue(`${e.note.name}${e.note.octave}`);
		});

		// Listen to control change events from the OP-Z's rotary encoders
		// Replace '14', '15', '16', '17' with the actual CC numbers for the OP-Z rotaries if different
		const rotaryCCNumbers = [1, 2, 3, 4]; // Example CC numbers, adjust according to OP-Z documentation
		rotaryCCNumbers.forEach((ccNumber, ccIndex) => {
			input.addListener("controlchange", "all", (e) => {
				if (e.controller.number === ccNumber) {
					console.log(`Rotary ${ccNumber} changed to ${e.value}`);
					// Create a new array with updated values for the rotary encoder
					// Create a new array with the updated value
          setRotaryValues(currentValues => currentValues.map((value, index) =>
          index === ccIndex ? e.value : value));
				}
			});
		});

    input.addListener("pitchbend", "all", (e)=>{
		console.log(`Pitchbend: ${e.value}`);
		// Apply the transformation formula directly
		const transformedValue = (e.value + 1) / 2;
		setCurrentPitchBendValue(transformedValue);
	});
	};

	return (
		<View style={styles.container}>
			{isReady ? (
				devices.map((device, index) => (
					<View>
						<TouchableOpacity
							key={index}
							onPress={() => startListeningToDevice(device)}
						>
							<Text style={styles.textContainer}>
								Device {index + 1}: {device.name}
							</Text>
						</TouchableOpacity>

						{/* Display Rotary encoder */}
						{selectedDevice && (
							<View>
								<View style={styles.horizontalContainer}>
									{/* Display Notes */}
									{
										<NoteDisplay
											noteValue={currentNoteValue}
										></NoteDisplay>
									}
									{rotaryValues.map((rotaryValue, rIndex) => (
										<RotaryEncoderIndicator
											key={rIndex}
											value={rotaryValue}
											maxValue={1}
										/>
									))}
								</View>

								{
									<PitchBendDisplay
										value={currentPitchBendValue}
										maxValue={1}
									></PitchBendDisplay>
								}
							</View>
						)}
					</View>
				))
			) : (
				<Text>Did not find connected devices.</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#333'
  },
  textContainer: {
    fontWeight: 'bold'
  }
});
