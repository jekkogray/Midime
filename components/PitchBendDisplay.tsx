import React from 'react';
import {StyleSheet } from 'react-native';
const PitchBendDisplay = ({ value, maxValue }) => (
	<progress value={value} max={maxValue} style={styles.progressBar}></progress>
);

const styles = StyleSheet.create({
	progressBar: {
		display: 'flex',
		width: 'auto'
	}
});
export default  PitchBendDisplay;