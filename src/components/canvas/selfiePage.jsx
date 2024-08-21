import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import { Rnd } from 'react-rnd';
import Button from 'react-bootstrap/Button';
import photo1 from '../../assets/selfie1.png';
import photo2 from '../../assets/selfie2.png';
import photo3 from '../../assets/selfie3.png';
import logo from '../../assets/logo.jpeg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Selfie = () => {
  const [selectedFrame, setSelectedFrame] = useState(photo2);
  const [capturedImage, setCapturedImage] = useState(null);
  const [frames, setFrames] = useState([photo2, photo3, photo1]);
  const [frameDimensions, setFrameDimensions] = useState({ width: 300, height: 300 });
  const [brightness, setBrightness] = useState(1); // Brightness state
  const webcamRef = useRef(null);
  const frameRef = useRef(null);

  // Function to resize image according to the frame dimensions
  const resizeImage = (src, callback) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = frameDimensions.width;
      canvas.height = frameDimensions.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, frameDimensions.width, frameDimensions.height);
      callback(canvas.toDataURL('image/jpeg'));
    };
  };

  // Update frame dimensions whenever a new frame is selected
  useEffect(() => {
    const img = new Image();
    img.src = selectedFrame;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxContainerSize = 300; // Set a max size for the container
      let width, height;

      if (aspectRatio >= 1) {
        width = maxContainerSize;
        height = maxContainerSize / aspectRatio;
      } else {
        height = maxContainerSize;
        width = maxContainerSize * aspectRatio;
      }

      setFrameDimensions({ width, height });
    };
  }, [selectedFrame]);

  // Capture the image from the webcam and resize it to fit the frame dimensions
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      resizeImage(imageSrc, (resizedImage) => {
        setCapturedImage(resizedImage);
      });
    }
  };

  // Handle frame upload and add it to the list of frames
  const handleFrameUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFrame = reader.result;
        const updatedFrames = [...frames, newFrame];
        setFrames(updatedFrames);
        localStorage.setItem('customFrames', JSON.stringify(updatedFrames));
        toast.success('Frame added successfully');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Something went wrong, try again');
    }
  };

  // Handle image upload and resize it to fit the frame dimensions
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resizeImage(reader.result, (resizedImage) => {
          setCapturedImage(resizedImage);
          toast.success('Image uploaded successfully');
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Something went wrong, try again');
    }
  };

  // Download the framed image
  const downloadImage = () => {
    if (frameRef.current) {
      html2canvas(frameRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1.0);
        link.download = 'framed-selfie.png';
        link.click();
      });
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <img src={logo} alt="" style={{ width: '300px' }} />
      <h4>Take a Selfie with a Frame!</h4>

      <div className="container-fluid">
        {/* Frame Preview */}
        <div className="frame-preview">
          <h5>Select a Frame</h5>
          <Button
            style={{ margin: '10px', alignItems: 'center', justifyContent: 'center' }}
            variant="danger"
          >
            <label htmlFor="frame-upload" className="upload-label">
              Upload Frame
            </label>
            <input type="file" accept="image/*" onChange={handleFrameUpload} />
          </Button>
          <div className="frame-preview-container">
            {frames.map((frame, index) => (
              <img
                key={index}
                src={frame}
                alt={`Frame ${index}`}
                className="frame-thumbnail"
                onClick={() => setSelectedFrame(frame)}
              />
            ))}
          </div>
        </div>

        <div className="frame-container">
          <div>
            <h5>Camera</h5>
            <div
              className="camera-container"
              style={{
                position: 'relative',
                width: `${frameDimensions.width}px`,
                height: `${frameDimensions.height}px`,
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: frameDimensions.width,
                  height: frameDimensions.height,
                  aspectRatio: frameDimensions.width / frameDimensions.height,
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {selectedFrame && (
                <img
                  src={selectedFrame}
                  alt="Selected Frame"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                  }}
                />
              )}
              <Button onClick={capture} variant="outline-danger" style={{ marginTop: '20px' }}>
                Capture Photo
              </Button>
              <Button
                variant="danger"
                className='upload-btn'
                style={{ marginTop: '10px', alignItems: 'center', justifyContent: 'center' }}
              >
                <label htmlFor="image-upload" className="upload-label">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  placeholder="upload frames"
                  style={{ justifyItems: 'center' }}
                />
              </Button>
            </div>
          </div>

          <div className="preview">
            <h5>Preview</h5>
            <div
              ref={frameRef}
              className="camera-container"
              style={{
                width: `${frameDimensions.width}px`,
                height: `${frameDimensions.height}px`,
                position: 'relative',
                border: '1px solid red',
                filter: `brightness(${brightness})`, // Apply brightness filter
              }}
            >
              {capturedImage && (
                <Rnd
                  default={{
                    x: 0,
                    y: 0,
                    width: frameDimensions.width,
                    height: frameDimensions.height,
                  }}
                  bounds="parent"
                  lockAspectRatio={true}
                  style={{
                    border: '2px dotted blue',
                    boxSizing: 'border-box',
                  }}
                >
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Rnd>
              )}
              {selectedFrame && (
                <img
                  src={selectedFrame}
                  alt="Selected Frame"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
            {capturedImage && (
              <div className="download-button-container">
                <Button
                  variant="outline-danger"
                  onClick={downloadImage}
                  style={{ marginTop: '20px' }}
                >
                  Download
                </Button>
                {/* Brightness adjustment */}
                <div className="brightness-slider">
                  <label>Brightness:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    style={{ marginTop: '10px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selfie;
