import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
// import './App.css';

const Selfie = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const frameRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc); // Save the captured image to state
    }
  };

  const downloadImage = () => {
    if (frameRef.current) {
      html2canvas(frameRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'framed-selfie.png';
        link.click();
      });
    }
  };

  return (
    <div className="App">
      <h1>Take a Selfie with a Frame!</h1>

      {/* Photo Frame Selection */}
      <div className="frame-selection">
        <button onClick={() => setSelectedFrame('https://your-image-hosting.com/path/to/your/image.png')}>Frame 1</button>
        <button onClick={() => setSelectedFrame('https://i.ibb.co/T0T2JNS/dd.png')}>Frame 2</button>
        <button onClick={() => setSelectedFrame('https://i.ibb.co/846vTdc/download.jpg')}>Frame 3</button>
        {/* Add more frames as needed */}
      </div>

      {/* Camera */}
      <div className="camera">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={300}
        />
        <button onClick={capture}>Capture Photo</button>
      </div>

      {/* Display and Frame the Captured Image */}
      {capturedImage && selectedFrame && (
        <div
          ref={frameRef}
          className="photo-frame"
          style={{
            width: '300px',
            height: '300px',
            backgroundImage: `url(${capturedImage}), url(${selectedFrame})`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          {/* The captured image and frame are combined here */}
        </div>
      )}

      {/* Download Button */}
      <button onClick={downloadImage}>Download Image</button>
    </div>
  );
};

export default Selfie;
