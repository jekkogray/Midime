import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebMidi } from 'webmidi';
import NoteDisplay from './components/NoteDisplay';
import RotaryEncoderIndicator from './components/RotaryEncoderIndicator';
import PitchBendDisplay from './components/PitchBendDisplay';
import ThreeCanvas from './components/ThreeCanvas';
import HelicopterCanvas from './components/HelicopterCanvas'

export default function App() {
	const [foundDevices, setFoundDevices] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [devices, setDevices] = useState([]);

	const [currentPitchBendValue, setCurrentPitchBendValue] = useState(0.5); // MIDI note value state
	const [currentNote, setCurrentNote] = useState(null); // MIDI note value state
	const [rotaryValues, setRotaryValues] = useState([0.0,0.0,0.0,0.0]); // Rotary encoder value state
	const rotaryColors = ['#10933f','#0dacc8', "#ffff00", "#ff8080" ]

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
		setFoundDevices(WebMidi.inputs.length > 0);
	};

	const startListeningToDevice = (input) => {
		setSelectedDevice(input);
		input.addListener("noteon", "all", (e) => {
			console.log(`Note on: ${e.note.name}${e.note.octave}`);
			setCurrentNote(e.note);

		});

		// Listen to control change events from the OP-Z's rotary encoders
		// Replace '14', '15', '16', '17' with the actual CC numbers for the OP-Z rotaries if different
		const rotaryCCNumbers = [1, 2, 3, 4]; // Example CC numbers, adjust according to OP-Z documentation
		rotaryCCNumbers.forEach((ccNumber, ccIndex) => {
			input.addListener("controlchange", "all", (e) => {
				if (e.controller.number === ccNumber) {
					console.log(`Rotary ${ccNumber} changed to ${e.value}`);
					// Create a new array with the updated value
					setRotaryValues((currentValues) =>
						currentValues.map((value, index) =>
							index === ccIndex ? e.value : value
						)
					);
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

	useEffect(()=>{
		if (!isReady) {
			let checker = rotaryValues.every(v => v.toFixed(2) === '0.50');
			setIsReady(checker);
		}
	},[rotaryValues]);

	return (
		<View style={styles.container}>
			{foundDevices ? (
				devices.map((device, index) => (
					<View>
						{!selectedDevice && (
							<TouchableOpacity
								key={index}
								onPress={() => startListeningToDevice(device)}
							>
								<Text style={styles.textContainer}>
									Device {index + 1}: {device.name}
								</Text>
							</TouchableOpacity>
						)}

						{/* Display Rotary encoder */}
						{selectedDevice && (
							<View>
								{/* Add 3D display */}
								{isReady && (
									<ThreeCanvas
										note={currentNote}
										rotaryValues={rotaryValues}
									/>
								)}

								{!isReady && (
									<View style={styles.setToDefault}>
										<Text style={styles.setToDefaultText}>Set Encoders to 0.5</Text>
									</View>
								)}

								<Text style={styles.textContainer}>
									Device {index + 1}: {device.name}
								</Text>
								<View style={styles.horizontalContainer}>
									{/* Display Notes */}
									{
										<NoteDisplay
											note={currentNote}
										></NoteDisplay>
									}
									{rotaryValues.map((rotaryValue, rIndex) => (
										<RotaryEncoderIndicator
											key={rIndex}
											value={rotaryValue}
											maxValue={1}
											tintColor={rotaryColors[rIndex]}
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
				<Text>No devices.</Text>
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
  },
  setToDefault:{
	height:500,
	width: 'auto',
	backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
	maxWidth: 640,
  },
  setToDefaultText: {
    fontWeight: 'bold',
	fontSize: 100,
	color: "#ff8080",
	textAlign:'center'
  }
});
