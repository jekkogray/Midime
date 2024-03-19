import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NoteDisplay = ({noteValue}) => (
	<View style={styles.container}>
		<Text style={styles.textContainer}>{noteValue}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: 120,
		height: 120,
		alignItems: 'center', // centers horizontally
		justifyContent: 'center', // centers vertically
	},
	textContainer:{
		fontSize: 80,
		fontWeight: 'bold',
		color: 'white',
	}
});


export default NoteDisplay;