import React from 'react';
import * as Progress from 'react-native-progress';

const NoteProgressBar = ({ noteValue, maxValue }) => (
  <Progress.Bar
    progress={noteValue / maxValue}
    width={200}
    color="#6200EE" // Example color, adjust as needed
  />
);

export default NoteProgressBar;