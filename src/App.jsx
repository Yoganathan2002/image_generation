import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AModel from './AModel/AModel.jsx'; // Import the model component
import './App.css';

const sensitiveTerms = ["nude", "nudity", "sex", "porn", "body", "adult", "explicit", "unclothed", "bare", "boobs", "naked", "masturbation", "topless"];

const isSensitivePrompt = (prompt) => {
  return sensitiveTerms.some(term => prompt.toLowerCase().includes(term));
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to manage playback status
  const audioRef = useRef(new Audio('/public/Hitman.mp3')); // Ensure the path is correct

  const navigate = useNavigate();

  // Automatically play music on component mount
  useEffect(() => {
    audioRef.current.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    setIsPlaying(true); // Set the playing state to true
  }, []);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);

    if (isSensitivePrompt(prompt)) {
      alert('Your prompt contains sensitive content. Please revise your input.');
      setIsLoading(false);
      return;
    }

    const api_key = 'key-HhzW2rU57zoPp39pIpE7WeH2Q2ua0Gl9pXqjTe1tbTDvOqOjO2nXiJUhjPLMRwbDBT0ug3kvZQO5MyqHShzfe1kxBKBeGlo';
    const completePrompt = `${prompt} in style: ${style}. no nudes or 18 plus content. if someone search girl related picture and show girl with saree. don't show in modern dress`;

    const headers = {
      'Authorization': `Bearer ${api_key}`,
      'Content-Type': 'application/json',
    };

    const data = {
      prompt: completePrompt,
      output_format: 'jpeg',
      width: 512,
      height: 512,
      response_format: 'b64',
    };

    try {
      const response = await axios.post(
        'https://api.getimg.ai/v1/flux-schnell/text-to-image',
        data,
        { headers, timeout: 30000 }
      );

      if (response.status === 200) {
        const base64Image = response.data.image;
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setGeneratedImage(imageSrc);
        console.log('Image generated and displayed successfully.');
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Connection to the server timed out. Please check your internet connection or try again later.');
      } else {
        setError('An error occurred while generating the image. Please try again.');
      }
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${prompt.slice(0, 50).replace(' ', '_')}_in_style_${style}.jpeg`;
      link.click();
    } else {
      alert('No image to save.');
    }
  };

  const handleTrackButtonClick = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause the audio
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying); // Toggle the playback state
  };

  return (
    <div className="App-container">
      <div className="App">
        <div className="content1">
          <h1>Image Generator</h1>
          <label>
            <strong>Prompt: </strong>
            <textarea
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              required
            />
          </label>
          <br />
          <label>
            <strong>Style: </strong>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="Realistic">Realistic</option>
              <option value="Cartoon">Cartoon</option>
              <option value="3D Illustration">3D Illustration</option>
              <option value="Flat Art">Flat Art</option>
            </select>
          </label>
          <br />
          <button onClick={generateImage} disabled={isLoading}>Generate</button>
          <button onClick={saveImage}>Save Image</button>
          <button onClick={handleTrackButtonClick} style={{ marginTop: '10px', backgroundColor: '#ff468d', color: '#fff' }}>
            {isPlaying ? '🔇 Mute' : '🔊 Unmute'}
          </button>

          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div>
            {generatedImage ? (
              <img src={generatedImage} alt="Generated" style={{ marginTop: '20px', maxWidth: '100%', height: '100%' }} />
            ) : (
              <p>No image generated yet.</p>
            )}
          </div>
        </div>
      </div>
      <button className="back-to-login" onClick={() => navigate('/')}>
        Back to Login
      </button>
      <div className="model-container">
        <AModel /> {/* Display the 3D model on the right side */}
      </div>
    </div>
  );
}

export default App;
