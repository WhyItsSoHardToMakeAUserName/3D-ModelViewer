'use client'

import dynamic from "next/dynamic";
import { useState } from "react";

const Scene = dynamic (() => import("@/components/3d-scene/one-object-scene"),{ssr:false})

export default function Page() {
  const [modelURL,setModelURL] = useState<string|null>(null);

  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      // Create an object URL for the file
      const url = URL.createObjectURL(file[0]);
      setModelURL(url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange}/>

      <div>
        <Scene modelURL={modelURL}/>
      </div>
    </div>
  );
}
