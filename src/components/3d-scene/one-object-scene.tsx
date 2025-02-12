'use client'

import { useEffect, useState } from 'react';
import * as THREE from 'three'
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

type Props = {
    modelURL:string|null
}

export default function OneObjectScene(props:Props){
    const [scene] = useState(new THREE.Scene());
    const [renderer] = useState(new THREE.WebGLRenderer());
    const [camera] = useState(new THREE.PerspectiveCamera(
        75, // FOV
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping
        1000 // Far clipping
    ));
    
    camera.position.z = 5;

    scene.add(new THREE.AxesHelper(5))

    scene.background = new THREE.Color('#ffffff')

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    
    const loader = new GLTFLoader();
    
    useEffect(()=>{
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement)

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.autoRotate = true;

        
        const animate = () => {
            requestAnimationFrame(animate);
        
            // Render the scene
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    },[])

    useEffect(()=>{
        if(props.modelURL){
            loader.load(
                // resource URL
                props.modelURL,
                // called when the resource is loaded
                function ( gltf ) {
            
                    scene.add( gltf.scene );
            
                    gltf.animations; // Array<THREE.AnimationClip>
                    gltf.scene; // THREE.Group
                    gltf.scenes; // Array<THREE.Group>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object
            
                    console.log("loaded")
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                }
            );
        }
        
    },[props.modelURL])
        
    return null;
}
