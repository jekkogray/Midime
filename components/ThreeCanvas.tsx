import * as THREE from 'three'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements, MeshProps} from "@react-three/fiber";

interface BoxProps extends MeshProps {
  rotaryValues?: Array<3>; // Define additional props here
}

function Box({rotaryValues ,...props}: BoxProps) {
	const meshRef = useRef<THREE.Mesh>(null!)
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	useFrame((state, delta) => {
		var addition = 0;
		if (rotaryValues){
			addition = rotaryValues[3]/2;
		}

		meshRef.current.rotation.x += addition;
	});


	return (
	  <mesh
		{...props}
		ref={meshRef}
		scale={active ? 1.5 : 1}
		onClick={(event) => setActive(!active)}
		onPointerOver={(event) => setHover(true)}
		onPointerOut={(event) => setHover(false)}>
		<boxGeometry args={[1, 1, 1]} />
		<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
	  </mesh>
	)
  }

function mapRange(value) {
	return -1.0 + 2.0 * value;
}

function midiNumberToIndex(number){
	return number - 52;
}

function ThreeCanvas({note, rotaryValues }) {
	if (note) {
		console.log(parseInt(note.name.charCodeAt(0)))
		console.log(`note.number: ${note.number}`);
	}

	return(<Canvas style={styles.canvasDisplay}>
		<ambientLight intensity={Math.PI / 2} />
		<spotLight
			position={[10, 10, 10]}
			angle={0.15}
			penumbra={1}
			decay={0}
			intensity={Math.PI}
		/>

{/* (note ? (midiNumberToIndex(note.number)) * 10: (1)) */}

		<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
		<Box position={[mapRange(rotaryValues[0])*10, mapRange(rotaryValues[1])*10, (mapRange(rotaryValues[2])* 10) ]} rotaryValues={rotaryValues} />
	</Canvas>);
}

const styles=StyleSheet.create({
	canvasDisplay:{
		width: 'auto',
		height: 500
	}
});

export default ThreeCanvas;