import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import Button from 'react-bootstrap/Button';
import photo2 from '../../assets/selfie2.png';
import photo3 from '../../assets/selfie3.png';
import photo4 from '../../assets/selfie4.png';
import logo from '../../assets/logo.jpeg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Selfie = () => {
  const [selectedFrame, setSelectedFrame] = useState(photo2);
  const [capturedImage, setCapturedImage] = useState(null);
  const [frames, setFrames] = useState([photo2, photo3, photo4]);
  const webcamRef = useRef(null);
  const frameRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const handleFrameUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFrame = reader.result;
        const updatedFrames = [...frames, newFrame];
        setFrames(updatedFrames);
        localStorage.setItem('customFrames', JSON.stringify(updatedFrames));
      };
      reader.readAsDataURL(file);
    }
    if (frames) {
      toast.success('Frame added successfully');
    } else {
      toast.error('Something went wrong, try again');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (capturedImage) {
      toast.success('Image uploaded successfully');
    } else {
      toast.error('Something went wrong, try again');
    }
  };

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
            variant="outline-secondary"
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
                width: '300px',
                height: '300px',
                backgroundSize: 'cover',
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
                height={300}
                style={{ objectFit: 'cover' }} // Ensures the webcam feed fills the frame
              />
              <Button onClick={capture} variant="outline-danger" style={{ marginTop: '20px' }}>
                Capture Photo
              </Button>
              <Button
                variant="outline-danger"
                style={{ marginTop: '10px', alignItems: 'center', justifyContent: 'center' }}
              >
                <label htmlFor="frame-upload" className="upload-label">
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

              {selectedFrame && (
                <div
                  className="photo-frame-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${selectedFrame})`,
                    backgroundSize: 'cover', // Ensure the frame fills the container even if it's smaller
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          </div>

          <div className="preview">
            <h5>Preview</h5>
            <div
              ref={frameRef}
              className="camera-container"
              style={{
                width: '300px',
                height: '300px',
                position: 'relative',
                border: '1px solid red',
              }}
            >
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                className="photo-frame-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${selectedFrame})`,
                  backgroundSize: 'cover', // Ensure the frame fills the container even if it's smaller
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                }}
              />
              <Button
                variant="outline-danger"
                onClick={downloadImage}
                style={{ marginTop: '20px' }}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selfie;
