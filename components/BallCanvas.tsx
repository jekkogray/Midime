import {Canvas, useFrame, MeshProps, useThree } from '@react-three/fiber';
import { useSphere, useBox, usePlane, Physics } from '@react-three/cannon';
import { StyleSheet } from 'react-native';
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three';
import {Colors} from '../utility/Utility';

function Box(props) {
	const [BoxRef, api] = useBox(() => ({ mass: 1, ...props }));

	return (
		<mesh ref={BoxRef} castShadow>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={"#5008000"} />
			{/* Add rotor and other parts */}
		</mesh>
	);
}

interface BoxProps extends MeshProps {
  rotaryValues?: Array<Number>; // Define additional props here
}

function Sphere({rotaryValues ,...props}: BoxProps) {
	const initialPosition = [0, 1, 2]; // Example: spawn 1 unit above the ground at the origin
	const [sphereRef, api] = useSphere(() => ({ mass: 10, position: initialPosition, ...props }));

	const arrowDirection = useRef(new THREE.Vector3(0, 0, 100));
	const arrowColor = Colors.green;

	useFrame(() => {
		if (sphereRef.current) {
		  const rotationY = Math.PI * 2 * -(rotaryValues[0] - 0.5);
		  sphereRef.current.quaternion.setFromEuler(new THREE.Euler(0, rotationY, 0));

		  // Assuming rotaryValues[1] controls forward/backward movement and rotaryValues[2] controls acceleration
		  const acceleration = -(rotaryValues[2] * 30); // This might need adjustment
		  const forwardMagnitude = (rotaryValues[1] - 0.5) * 2; // Normalize [-1, 1]
		  const forward = new THREE.Vector3(0, 0, forwardMagnitude * acceleration).applyQuaternion(sphereRef.current.quaternion);

		  // Apply a force in the direction the sphere is facing
		  api.applyForce([forward.x, 0, forward.z], [0, 0, 0]); // Apply force only in horizontal directions

		  // Update arrow direction
		  arrowDirection.current.set(0, 0, -1).applyQuaternion(sphereRef.current.quaternion);
		}
	  });

	return (
	  <>
		<mesh ref={sphereRef}>
		  <sphereGeometry args={[1, 32, 32]} />
		  <meshStandardMaterial color="red" />
		</mesh>
		<arrowHelper
		  args={[arrowDirection.current, new THREE.Vector3(0, 0, 0), 2, arrowColor]}
		  position={[0, 1, 0]}
		/>
	  </>
	);
}

function Plane(props) {
	const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
	return (
	  <mesh ref={ref}>
		<planeGeometry args={[100, 100]} />
	  </mesh>
	)
  }


function BallCanvas({note, rotaryValues}) {
	return (
		<Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} style={styles.canvasDisplay}>
			<ambientLight intensity={0.5} />
			<directionalLight position={[25, 50, 25]} castShadow />
			<Physics>
				<Box position={[6, 5, -6]}/>
				<Box position={[4, 5, -4]}/>
				<Box position={[2, 5, -2]}/>
				<Box position={[0, 5, 0]}/>
				<Box position={[-2, 5, -2]}/>
				<Box position={[-4, 5, -4]}/>
				<Box position={[-6, 5, -6]}/>
				<Sphere rotaryValues={rotaryValues}/>
			<Plane/>
			</Physics>
		</Canvas>
	);
}


const styles=StyleSheet.create({
	canvasDisplay:{
		width: 'auto',
		height: 500
	}
});


export default BallCanvas;
