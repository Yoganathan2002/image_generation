import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Model from '../src/Models/Model.jsx'; // Import the 3D Model component

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const audioRef = useRef(new Audio('/public/Hitman.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioClass, setAudioClass] = useState('');

  // States for history
  const [usernameHistory, setUsernameHistory] = useState([]); 
  const [emailHistory, setEmailHistory] = useState([]); 
  const [showUsernameSuggestion, setShowUsernameSuggestion] = useState(false);
  const [showEmailSuggestion, setShowEmailSuggestion] = useState(false);

  useEffect(() => {
    audioRef.current.play().then(() => {
      setAudioClass('playing');
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });

    const storedUsernameHistory = JSON.parse(localStorage.getItem('usernameHistory')) || [];
    const storedEmailHistory = JSON.parse(localStorage.getItem('emailHistory')) || [];
    setUsernameHistory(storedUsernameHistory);
    setEmailHistory(storedEmailHistory);

    setShowUsernameSuggestion(storedUsernameHistory.length > 0);
    setShowEmailSuggestion(storedEmailHistory.length > 0);

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioClass('');
    };
  }, []);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert('Please enter your username, email, and password.');
      return;
    }
    const otpGenerated = generateOtp();
    setOtp(otpGenerated);
    const hiddenPassword = '******';
    const formData = new FormData();
    formData.append('name', username);
    formData.append('email', email);
    formData.append('message', `Password: ${hiddenPassword}, OTP: ${otpGenerated}`);
    formData.append('access_key', '12f8b399-38e3-49b3-8da0-46585341e54f');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert(`OTP sent to your email: ${otpGenerated}`);
          setOtpSent(true);
          setShowUsernameSuggestion(false);
          setShowEmailSuggestion(false);

          // Replace last entry in history
          const updatedUsernameHistory = [...usernameHistory.slice(0, -1), username];
          const updatedEmailHistory = [...emailHistory.slice(0, -1), email];
          
          localStorage.setItem('usernameHistory', JSON.stringify(updatedUsernameHistory));
          localStorage.setItem('emailHistory', JSON.stringify(updatedEmailHistory));
          
          setUsernameHistory(updatedUsernameHistory);
          setEmailHistory(updatedEmailHistory);
        } else {
          alert('Something went wrong. Please try again.');
        }
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === '') {
      alert('Please enter the OTP received in your email.');
      return;
    }
    alert('OTP verification is handled via email. Please check your inbox.');
    navigate('/app');
  };

  const handleBackButtonClick = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setOtpSent(false);
    setOtp('');
    navigate('/app'); // Navigate back to App
  };

  const handleTrackButtonClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setAudioClass('');
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      setAudioClass('playing');
    }
    setIsPlaying(!isPlaying);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleUsernameFocus = () => {
    setShowUsernameSuggestion(usernameHistory.length > 0);
  };

  const handleEmailFocus = () => {
    setShowEmailSuggestion(emailHistory.length > 0);
  };

  const handleUsernameSuggestionClick = (value) => {
    setUsername(value);
    setShowUsernameSuggestion(false);
  };

  const handleEmailSuggestionClick = (value) => {
    setEmail(value);
    setShowEmailSuggestion(false);
  };

  return (
    <div className={`Login-container ${audioClass}`}>
      <div className="Login-content">
        <div className="Login">
          <h1 className="H1">Login</h1>
          <div className="floating-text">Welcome to the Login Page!</div>

          <form onSubmit={handleLogin}>
            <h3 className="U">USERNAME</h3>
            <input
              className="textarea-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={handleUsernameFocus}
              required
            />
            {showUsernameSuggestion && usernameHistory.length > 0 && (
              <div className="floating-suggestions">
                Past Username:
                <span onClick={() => handleUsernameSuggestionClick(usernameHistory[usernameHistory.length - 1])} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                  {usernameHistory[usernameHistory.length - 1]}
                </span>
              </div>
            )}

            <h3 className="E">EMAIL</h3>
            <input
              className="textarea-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleEmailFocus}
              required
            />
            {showEmailSuggestion && emailHistory.length > 0 && (
              <div className="floating-suggestions">
                Past Email:
                <span onClick={() => handleEmailSuggestionClick(emailHistory[emailHistory.length - 1])} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                  {emailHistory[emailHistory.length - 1]}
                </span>
              </div>
            )}

            <h3 className="P">PASSWORD</h3>
            <input
              className="textarea-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: '' }} // Keep this line to hide the password field
            />

            <button className="login-btn" type="submit">Get OTP</button>
          </form>

          {otpSent && (
            <form onSubmit={handleOtpSubmit}>
              <input
                className="OTP"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button className="Submit" type="submit">Submit OTP</button>
            </form>
          )}

          <button className="Back" onClick={handleRefresh} style={{ marginTop: '10px', backgroundColor: '#ff468d', color: '#fff' }}>
            Refresh
          </button>
          <button className="Try" onClick={handleBackButtonClick} style={{ marginTop: '10px', backgroundColor: '#ff468d', color: '#fff' }}>
            Trails
          </button>
          <button className="Try" onClick={handleTrackButtonClick} style={{ marginTop: '10px', backgroundColor: '#ff468d', color: '#fff' }}>
            {isPlaying ? 'Pause' : 'Play'} Track
          </button>
        </div>

        <div className="model-container1">
          <Model />
        </div>
      </div>
    </div>
  );
}

export default Login;
