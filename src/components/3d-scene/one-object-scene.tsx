'use client'

import { useEffect, useState } from 'react';
import * as THREE from 'three'
import { GLTF, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

type Props = {
    modelURL:string|null
}

export default function OneObjectScene(props:Props){
    const [currentAnimationIndex, setCurrentAnimationIndex] = useState<number|null>(null);
    const [infinitelyAnimate,setInfinitelyAnimate] = useState(false)
    const [loadedModel,setLoadedModel] = useState<GLTF|null>(null);

    const [scene] = useState(new THREE.Scene());
    const [renderer] = useState(new THREE.WebGLRenderer());
    const [camera] = useState(new THREE.PerspectiveCamera(
        75, // FOV
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping
        1000 // Far clipping
    ));
    const [animationMixer,setAnimationMixer] = useState<THREE.AnimationMixer|null>(null)
    
    const loader = new GLTFLoader();
    
    useEffect(()=>{
        console.log("init")
        camera.position.z = 5;

        scene.background = new THREE.Color('#e5e5e5')
    
        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );    

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement)

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.autoRotate = false;
    },[])

    useEffect(()=>{
        if(props.modelURL){
            loader.load(
                // resource URL
                props.modelURL,
                // called when the resource is loaded
                function ( gltf ) {
                    scene.add( gltf.scene );
                    
                    if(loadedModel){
                        scene.remove(loadedModel.scene)
                    }
                    setLoadedModel(gltf);

                    if(gltf.animations.length!=0){
                        const AnimationMixer = new THREE.AnimationMixer(gltf.scene)
                        setAnimationMixer(AnimationMixer)
                    }

                    console.log("model loaded successfully")
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


    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);
    
            if (animationMixer) {
                animationMixer.update(1 / 60);
            }
    
            renderer.render(scene, camera);
        };
        animate();
    }, [animationMixer]);


    const handleAnimationPlay = (index: number) => {
        setCurrentAnimationIndex(index);
        if (animationMixer && loadedModel) {
            animationMixer.stopAllAction();
            const action = animationMixer.clipAction(loadedModel.animations[index]);

            if (!infinitelyAnimate) {
                action.setLoop(THREE.LoopOnce, 0);
                action.clampWhenFinished = true;
            } else {
                action.setLoop(THREE.LoopRepeat, Infinity);
            }
            console.log("playing anim");
            action.reset().play();
        }
    };

    useEffect(() => {
        if (currentAnimationIndex !== null) {
            handleAnimationPlay(currentAnimationIndex);
        }
    }, [infinitelyAnimate]);

        
    return (
        <div>
            {
                loadedModel && loadedModel.animations.length > 0 && (
                    <div>
                        <h3>Available Animations:</h3>
                        {
                            loadedModel.animations.map((animation, index) => (
                                <button 
                                className='bg-slate-400 text-4xl rounded-full m-3 px-3 hover:bg-slate-600'
                                    key={index} 
                                    onClick={()=>{handleAnimationPlay(index)}}
                                    >
                                    {animation.name || `Animation ${index + 1}`}
                                </button>
                            ))
                        }
                    </div>
                )
            }
            <div>
                <button onClick={()=>{setInfinitelyAnimate(false)}}>once</button>
                <button onClick={()=>{setInfinitelyAnimate(true)}}>infinite</button>
            </div>
        </div>
    );
    
}
