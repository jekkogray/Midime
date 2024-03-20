import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

const RotaryEncoderIndicator = ({ value, maxValue, tintColor }) => (
  <CircularProgress
    size={120} // Diameter of the circle
    width={15} // Thickness of the progress line
    fill={(value / maxValue) * 100} // Convert to percentage
    tintColor={tintColor} // Example color, adjust as needed
    backgroundColor="#3e3e3e" // Background color of the circle
    padding={10} // Optional padding around the circle
  >
    {
      (fill) => (
        <Animated.Text style={value.toFixed(2)==='0.50'? (styles.textContainerGood):(styles.textContainerBad)}>
			{value.toFixed(2)}
        </Animated.Text>
      )
    }
  </CircularProgress>
);

const styles = StyleSheet.create ({
  textContainerGood: {
    color: '#10933f' ,
    fontWeight: 'bold'
  },
  textContainerBad: {
    color: 'white' ,
    fontWeight: 'bold'
  }
});

export default RotaryEncoderIndicator;