import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import midiToNoteMapping from '../utility/Utility'

function isSharp(noteNumber) {
	  // Define the starting MIDI note number for C3 as a reference point
	  const C4_MIDI_NUMBER = 67;

	  // Calculate the note's position in the chromatic scale relative to C3
	  const position = (noteNumber - C4_MIDI_NUMBER) % 12;

	  // Positions in the chromatic scale that correspond to sharp notes, relative to C
	  const sharpPositions = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#

	  // Check if the note's position is in the list of sharpPositions
	  return sharpPositions.includes(position);
}

function getNoteString(note){
	return `${midiToNoteMapping[note.number]}`
}

function NoteDisplay({note: note}){

	return (
		<View style={styles.container}>
			<Text style={styles.textContainer}>{note? (getNoteString(note)):("")}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 120,
		height: 120,
		alignItems: 'center', // centers horizontally
		justifyContent: 'center', // centers vertically
	},
	textContainer:{
		fontSize: 50,
		fontWeight: 'bold',
		color: 'white',
	}
});


export default NoteDisplay;