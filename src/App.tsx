import React, { useEffect, useState } from 'react';
import './styles/globals.css';
import { useNotification } from './components/Notification';
import DealDetails from './pages/app/DealDetails';
import CommitInvestment from './pages/app/CommitInvestment';

// Simple Loading Component
const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#1a1a1a'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #374151',
        borderTop: '4px solid #00fb57',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );
};

// GetStarted Component
const GetStarted = () => {
  const handleGetStarted = () => {
    window.history.pushState({}, '', '/phone-number');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '15px',
      color: 'white'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '50px',
        textAlign: 'center',
        fontFamily: 'TiemposText-Regular, serif'
      }}>
        Invest in What's Next.
      </h1>
      
      <button 
        onClick={handleGetStarted}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          border: 'none',
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: '500',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          marginBottom: '10px'
        }}
      >
        Get started
      </button>
    </div>
  );
};

// PhoneNumber Component
interface PageProps {
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const PhoneNumber: React.FC<PageProps> = ({ showNotification }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
              showNotification('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      const response = await fetch(
        `https://api.fundos.services/api/v0/test/user/phone/otp/send?phone_number=${phoneNumber}&invite_code=${invitationCode}`
      );
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('phoneNumber', phoneNumber);
        localStorage.setItem('invitationCode', invitationCode);
        if (data.user_id) {
          localStorage.setItem('userId', data.user_id);
        }
        window.history.pushState({}, '', '/verify-phone-otp');
        window.location.reload();
      } else {
        showNotification(data.message || 'Failed to send OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to send OTP. Please check your internet connection.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/get-started');
    window.location.reload();
  };

  const handlePhoneNumberChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>
        
              <h1 style={{ 
        marginBottom: '1rem',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        Enter phone number
      </h1>
      
      <p style={{ 
        color: '#00ffcc', 
        marginBottom: '2rem',
        lineHeight: '1.6',
        fontSize: '14px'
      }}>
        Your number helps us verify your identity and keep your account secure.
      </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}>
              Phone Number
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #374151',
              borderRadius: '8px',
              background: '#374151',
              overflow: 'hidden'
            }}>
              <span style={{
                color: 'white',
                padding: '1rem',
                fontSize: '1rem',
                borderRight: '1px solid #6b7280'
              }}>
                +91
              </span>
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter 10-digit number"
                maxLength={10}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}>
              Invitation Code (optional)
            </label>
            <input 
              type="text" 
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              placeholder="Enter invitation code"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#374151',
                color: 'white'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={phoneNumber.length !== 10}
            style={{
              background: phoneNumber.length === 10 ? '#00fb57' : '#374151',
              color: phoneNumber.length === 10 ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: phoneNumber.length === 10 ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

// VerifyPhoneOTP Component - 4 digit OTP like Android
const VerifyPhoneOTP: React.FC<PageProps> = ({ showNotification }) => {
  const [otp, setOTP] = useState(['', '', '', '']);
  const phoneNumber = localStorage.getItem('phoneNumber') || '';
  const invitationCode = localStorage.getItem('invitationCode') || '';

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < 3) {
        const nextInput = document.getElementById(`phone-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`phone-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      showNotification('Please enter complete 4-digit OTP', 'error');
      return;
    }

    try {
      const response = await fetch(
        `https://api.fundos.services/api/v0/test/user/phone/otp/verify?phone_number=${phoneNumber}&otp=${otpValue}&invite_code=${invitationCode}`
      );
      const data = await response.json();
      
      // Handle API response following Android logic
      if (!data) {
        showNotification('Failed to verify OTP. Please try again.', 'error');
        return;
      }
      
      if (!data.success) {
        showNotification(data.message || 'Failed to verify OTP. Please try again.', 'error');
        return;
      }
      
      // Show success message if provided
      if (data.message) {
        showNotification(data.message, 'success');
      }
      
      if (data.success) {
        // Store user ID and other data for subsequent calls
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('fundManagerId', data.fund_manager_id);
        
        // Debug logging
        console.log('Phone OTP verification response:', data);
        console.log('Onboarding status:', data.onboarding_status);
        
        // Check onboarding status (matching Android logic)
        if (data.onboarding_status === 'Completed') {
          console.log('Onboarding completed - redirecting to dashboard');
          showNotification('Welcome back! Redirecting to dashboard...', 'success');
          window.history.pushState({}, '', '/dashboard');
        } else {
          console.log('Onboarding incomplete - continuing to email entry');
          showNotification('Please complete your email verification to continue', 'info');
          window.history.pushState({}, '', '/email-entry');
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to verify OTP. Please check your internet connection.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/phone-number');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Verify your number
        </h1>
        
        <p style={{ 
          color: '#00ffcc', 
          marginBottom: '2rem',
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          We have sent a verification code to your number +91-{phoneNumber}.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}>
              Enter 4-digit verification code
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`phone-otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    background: '#374151',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              ))}
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={otp.join('').length !== 4}
            style={{
              background: otp.join('').length === 4 ? '#00fb57' : '#374151',
              color: otp.join('').length === 4 ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: otp.join('').length === 4 ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

// EmailEntry Component
const EmailEntry: React.FC<PageProps> = ({ showNotification }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (email.length < 3 || !email.includes('@')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/email/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('email', email);
        window.history.pushState({}, '', '/verify-email-otp');
        window.location.reload();
      } else {
        showNotification(data.message || 'Failed to send OTP to email. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to send OTP. Please check your internet connection.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/verify-phone-otp');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Enter your mail ✉️
        </h1>
        
        <p style={{ 
          color: '#00ffcc', 
          marginBottom: '2rem',
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          Make sure it's one you check regularly.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}>
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#374151',
                color: 'white'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={email.length < 3}
            style={{
              background: email.length >= 3 ? '#00fb57' : '#374151',
              color: email.length >= 3 ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: email.length >= 3 ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

// VerifyEmailOTP Component - 6 digit OTP like Android
const VerifyEmailOTP: React.FC<PageProps> = ({ showNotification }) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const email = localStorage.getItem('email') || '';
  const userId = localStorage.getItem('userId') || '';

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < 5) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showNotification('Please enter complete 6-digit OTP', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/email/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
          otp: otpValue,
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification('Email Verified Successfully', 'success');
        window.history.pushState({}, '', '/choose-investor');
        window.location.reload();
      } else {
        showNotification('Failed to verify OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to verify OTP. Please check your internet connection.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/email-entry');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Verify your Email
        </h1>
        
        <p style={{ 
          color: '#00ffcc', 
          marginBottom: '2rem',
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          We have sent a verification code to your email.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}>
              Enter 6-digit verification code
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`email-otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    background: '#374151',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              ))}
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={otp.join('').length !== 6}
            style={{
              background: otp.join('').length === 6 ? '#00fb57' : '#374151',
              color: otp.join('').length === 6 ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            Verify →
          </button>
        </form>
      </div>
    </div>
  );
};

// ChooseInvestor Component
const ChooseInvestor: React.FC<PageProps> = ({ showNotification }) => {
  const [selectedType, setSelectedType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const userId = localStorage.getItem('userId') || '';

  const investorOptions = [
    {
      value: 'individual',
      label: 'Individual Investor',
      description: "I'm investing as a person using my personal capital",
    },
  ];

  const handleNext = async () => {
    console.log('handleNext called with value:', selectedType);
    
    if (!selectedType) {
      showNotification('Please select an investor type', 'error');
      return;
    }

    if (!userId) {
      showNotification('User ID not found. Please login again.', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/choose-investor-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investor_type: selectedType,
          user_id: userId,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data) {
        console.log('API response:', data);
        setShowModal(true);
      } else {
        console.error('API error:', data);
        showNotification('Failed to choose investor type. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showNotification('Failed to choose investor type. Please try again.', 'error');
    }
  };

  const handleDeclaration = async () => {
    if (!isChecked) {
      showNotification('Please confirm that you qualify as an Angel Investor before proceeding.', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/declaration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          declaration_accepted: isChecked,
          user_id: userId,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data) {
        console.log('Declaration API response:', data);
        if (data.message) {
          showNotification(data.message, 'success');
        }
        setShowModal(false);
        // Navigate to KYC Start Screen
        window.history.pushState({}, '', '/kyc-start');
        window.location.reload();
      } else {
        console.error('Declaration API error:', data);
        showNotification('Failed to apply for declarations. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Declaration network error:', error);
      showNotification('Failed to apply for declarations. Please try again.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/verify-email-otp');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          marginBottom: '1rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Choose investor type
        </h1>
        
        <p style={{ 
          color: '#00fb57', 
          marginBottom: '2rem',
          lineHeight: '1.6',
          fontSize: '0.9rem'
        }}>
          Make sure you select a correct type.
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          {investorOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelectedType(option.value)}
              style={{
                border: `2px solid ${selectedType === option.value ? '#00fb57' : '#374151'}`,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                background: selectedType === option.value ? 'rgba(0, 251, 87, 0.1)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedType === option.value ? '#00fb57' : '#6b7280'}`,
                  marginRight: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedType === option.value && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#00fb57'
                    }} />
                  )}
                </div>
                <h3 style={{ 
                  color: selectedType === option.value ? '#00fb57' : 'white',
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {option.label}
                </h3>
              </div>
              <p style={{
                color: '#9ca3af',
                margin: 0,
                fontSize: '0.9rem',
                marginLeft: '2.75rem'
              }}>
                {option.description}
              </p>
            </div>
          ))}
        </div>
        
        {selectedType && (
          <button 
            onClick={handleNext}
            style={{
              background: '#00fb57',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Next
          </button>
        )}

        {/* Modal for Declaration */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: 'white', margin: 0 }}>Declaration</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                I am an individual investor who has net tangible assets of at least two crore rupees excluding value of my principal residence, and:
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#e5e7eb', margin: '0.5rem 0' }}>
                  1. have early-stage investment experience, or
                </p>
                <p style={{ color: '#e5e7eb', margin: '0.5rem 0' }}>
                  2. have experience as a serial entrepreneur, or
                </p>
                <p style={{ color: '#e5e7eb', margin: '0.5rem 0' }}>
                  3. am a senior management professional(s) with at least ten years of experience.
                </p>
              </div>

              <div 
                onClick={() => setIsChecked(!isChecked)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  marginBottom: '2rem',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: `2px solid ${isChecked ? '#00fb57' : '#6b7280'}`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isChecked ? '#00fb57' : 'transparent',
                  marginTop: '2px'
                }}>
                  {isChecked && <span style={{ color: '#1a1a1a', fontSize: '12px' }}>✓</span>}
                </div>
                <div>
                  <span style={{ color: '#e5e7eb', lineHeight: '1.5' }}>
                    I confirm that I qualify as an Angel Investor based on the above condition(s)
                    <span style={{ color: '#ef4444' }}>*</span>
                  </span>
                </div>
              </div>

              <button 
                onClick={handleDeclaration}
                disabled={!isChecked}
                style={{
                  background: isChecked ? '#00fb57' : '#374151',
                  color: isChecked ? '#1a1a1a' : '#6b7280',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: isChecked ? 'pointer' : 'not-allowed',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Agree and continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// KYC Start Component
const KYCStart: React.FC<PageProps> = ({ showNotification }) => {
  const handleCompleteKYC = () => {
    // Navigate to Aadhaar verification screen
    window.history.pushState({}, '', '/aadhaar-verification');
    window.location.reload();
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/choose-investor');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Secure your Investments
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          We verify your identity to protect your account, ensure regulatory compliance, and give you access to exclusive deals.
        </p>

        <button
          onClick={handleCompleteKYC}
          style={{
            backgroundColor: '#00fb57',
            color: '#1a1a1a',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          Complete KYC Now
        </button>
      </div>
    </div>
  );
};

// Aadhaar Verification Component
const AadhaarVerification: React.FC<PageProps> = ({ showNotification }) => {
  const [showProceed, setShowProceed] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleVerifyAadhaar = async () => {
    try {
      const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/generate-url?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success && data.short_url) {
        // Open Aadhaar verification URL in new tab
        window.open(data.short_url, '_blank');
        setShowProceed(false);
        setShowRetry(false);
        setTimeout(() => {
          setShowProceed(true);
          setShowRetry(true);
        }, 5000);
      } else {
        showNotification('Failed to fetch Aadhaar redirect URL', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to fetch Aadhaar redirect URL', 'error');
    }
  };

  const handleProceedNext = async () => {
    try {
      const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/details?user_id=${userId}`, {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message || 'Aadhaar verification status checked successfully', 'success');
        window.history.pushState({}, '', '/pan-verification');
        window.location.reload();
      } else {
        showNotification(data.message || 'Please complete your Aadhaar verification', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to check Aadhaar verification status', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/kyc-start');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Aadhaar KYC Verification
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Complete your Aadhaar verification to finish KYC and begin investing.
        </p>

        {!showProceed && (
          <button
            onClick={handleVerifyAadhaar}
            style={{
              backgroundColor: '#00fb57',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            Verify Aadhaar Now
          </button>
        )}

        {showRetry && (
          <button
            onClick={handleVerifyAadhaar}
            style={{
              backgroundColor: '#ffb800',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            Retry Verification
          </button>
        )}

        {showProceed && (
          <button
            onClick={handleProceedNext}
            style={{
              backgroundColor: '#00fb57',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Proceed Next
          </button>
        )}
      </div>
    </div>
  );
};

// Verify Aadhaar OTP Component
const VerifyAadhaarOTP: React.FC<PageProps> = ({ showNotification }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedAadhaar = localStorage.getItem('aadhaarNumber');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedAadhaar) {
      setAadhaarNumber(storedAadhaar);
    }
  }, []);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showNotification('Please enter complete 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.fundos.services/api/v1/live/kyc/aadhaar/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          aadhaar_number: aadhaarNumber,
          otp: otpString,
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message || 'Aadhaar verified successfully', 'success');
        localStorage.removeItem('aadhaarNumber'); // Clean up
        window.history.pushState({}, '', '/pan-verification');
        window.location.reload();
      } else {
        showNotification(data.message || 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to verify OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/aadhaar-verification');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Verify Aadhaar OTP
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Enter the 6-digit OTP sent to your Aadhaar registered mobile number.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '2rem',
            justifyContent: 'center'
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '50px',
                  height: '50px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: '2px solid #374151',
                  background: '#374151',
                  color: 'white',
                  outline: 'none'
                }}
                maxLength={1}
              />
            ))}
          </div>
          
          <button 
            type="submit"
            disabled={otp.join('').length !== 6 || loading}
            style={{
              background: (otp.join('').length === 6 && !loading) ? '#00fb57' : '#374151',
              color: (otp.join('').length === 6 && !loading) ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: (otp.join('').length === 6 && !loading) ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

// PAN Verification Component
const PANVerification: React.FC<PageProps> = ({ showNotification }) => {
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (pan.length !== 10) {
      showNotification('Please enter a valid 10-character PAN number', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.fundos.services/api/v1/live/kyc/pan/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          pan_number: pan,
          tax_identity_number: pan, // Set tax identity number same as PAN
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('panNumber', pan);
        showNotification(data.message || 'PAN verified successfully', 'success');
        window.history.pushState({}, '', '/bank-details');
        window.location.reload();
      } else {
        showNotification('Invalid PAN Number. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Invalid PAN Number. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/aadhaar-verification');
    window.location.reload();
  };

  const handlePanChange = (e: any) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 10) {
      setPan(value);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #374151',
            borderTop: '4px solid #00fb57',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '500', color: '#FDFDFD' }}>
            Please wait...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Enter your Pan Card
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          We'll use this to verify your identity and comply with regulations.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={pan}
              onChange={handlePanChange}
              placeholder="Enter your pan number"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#374151',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={pan.length !== 10}
            style={{
              background: pan.length === 10 ? '#00fb57' : '#374151',
              color: pan.length === 10 ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: pan.length === 10 ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            Next →
          </button>
        </form>
      </div>
    </div>
  );
};

// BankDetails Component
const BankDetails: React.FC<PageProps> = ({ showNotification }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [panNumber, setPanNumber] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedPanNumber = localStorage.getItem('panNumber');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedPanNumber) {
      setPanNumber(storedPanNumber);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!accountNumber || !ifscCode) {
      showNotification('Please fill in all bank details', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.fundos.services/api/v1/live/kyc/pan/bank/link/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          pan_number: panNumber,
          bank_account_number: accountNumber,
          ifsc_code: ifscCode,
          tax_identity_number: panNumber, // Set tax identity number same as PAN
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification(data.message || 'Bank details verified successfully', 'success');
        window.history.pushState({}, '', '/professional-background');
        window.location.reload();
      } else {
        showNotification(data.message || 'Failed to verify bank. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Bank Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/pan-verification');
    window.location.reload();
  };

  const handleIfscChange = (e: any) => {
    setIfscCode(e.target.value.toUpperCase());
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #374151',
            borderTop: '4px solid #00fb57',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '500', color: '#FDFDFD' }}>
            Please wait...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Bank Details
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Share your bank account details.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your bank account number"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#374151',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={ifscCode}
              onChange={handleIfscChange}
              placeholder="Enter your IFSC"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#374151',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={!accountNumber || !ifscCode}
            style={{
              background: (accountNumber && ifscCode) ? '#00fb57' : '#374151',
              color: (accountNumber && ifscCode) ? '#1a1a1a' : '#6b7280',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: (accountNumber && ifscCode) ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Proceed →
          </button>
        </form>
      </div>
    </div>
  );
};

// Professional Background Component
const ProfessionalBackground: React.FC<PageProps> = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    occupation: '',
    income_source: '',
    annual_income: '',
    capital_commitment: ''
  });
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const options = {
    occupation: [
      { label: 'Founder', value: 'founder' },
      { label: 'Employee', value: 'employee' },
      { label: 'Self-employed', value: 'self_employed' },
      { label: 'Other', value: 'other' },
    ],
    income_source: [
      { label: 'Business', value: 'business' },
      { label: 'Salary', value: 'salary' },
      { label: 'Investments', value: 'investments' },
      { label: 'Other', value: 'other' },
    ],
    annual_income: [
      { label: '25L - 50L', value: '2500000' },
      { label: '50L - 1Cr', value: '5000000' },
      { label: '1Cr - 5Cr', value: '10000000' },
      { label: '>5Cr', value: '50000000' },
    ],
    capital_commitment: [
      { label: '25L - 50L', value: '2500000' },
      { label: '50L - 1Cr', value: '5000000' },
      { label: '1Cr - 5Cr', value: '10000000' },
      { label: '>5Cr', value: '50000000' },
    ],
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.occupation || !formData.income_source || !formData.annual_income || !formData.capital_commitment) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/professional-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          occupation: formData.occupation,
          income_source: formData.income_source,
          annual_income: parseInt(formData.annual_income),
          capital_commitment: parseInt(formData.capital_commitment),
        }),
      });
      const data = await response.json();
      
      if (data.success || response.ok) {
        showNotification(data.message || 'Professional background submitted successfully', 'success');
        window.history.pushState({}, '', '/user-details');
        window.location.reload();
      } else {
        showNotification('Failed to submit professional background. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to submit professional background. Please try again.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/bank-details');
    window.location.reload();
  };

  const renderDropdown = (name: keyof typeof options, label: string) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{
        color: '#bbb',
        marginBottom: '6px',
        fontSize: '14px',
        display: 'block'
      }}>
        {label}
      </label>
      <select
        value={formData[name]}
        onChange={(e) => setFormData({...formData, [name]: e.target.value})}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #444',
          background: '#111',
          color: 'white',
          outline: 'none'
        }}
      >
        <option value="" style={{ background: '#111', color: '#888' }}>Select</option>
        {options[name].map((option) => (
          <option key={option.value} value={option.value} style={{ background: '#111', color: 'white' }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          Professional Background
        </h1>
        
        <p style={{
          color: '#bbb',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Share your occupation details to help us better understand your background
        </p>

        <form onSubmit={handleSubmit}>
          {renderDropdown('occupation', 'Occupation')}
          {renderDropdown('income_source', 'Income Source')}
          {renderDropdown('annual_income', 'Annual Income')}
          {renderDropdown('capital_commitment', 'Capital Commitment (Over 5 Years)')}
          
          <button 
            type="submit"
            style={{
              background: '#00fb57',
              color: '#1a1a1a',
              border: 'none',
              padding: '14px 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
};

// UserDetails Component
const UserDetails: React.FC<PageProps> = ({ showNotification }) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    father_name: '',
    entity_type: '',
    pan_number: '',
    capital_commitment: '',
    resident: '',
    date_of_birth: '',
    tax_identity_number: '' // Add this field for backend compatibility
  });
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        try {
          const response = await fetch(`https://api.fundos.services/api/v0/test/user/details?user_id=${storedUserId}`);
          const data = await response.json();
          
          if (data.success) {
            // Function to format date from various formats to DD/MM/YYYY for display
            const formatDateForDisplay = (dateString: string) => {
              if (!dateString) return '';
              
              // If already in DD/MM/YYYY or DD-MM-YYYY format, return as is
              if (dateString.match(/^\d{2}[/-]\d{2}[/-]\d{4}$/)) {
                return dateString.replace(/-/g, '/');
              }
              
              // If in YYYY-MM-DD format, convert to DD/MM/YYYY
              if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}/${year}`;
              }
              
              // Try to parse as a date and format
              try {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              } catch {
                return dateString; // Return original if parsing fails
              }
            };

            setUserProfile({
              full_name: data.data.full_name || '',
              email: data.data.email || '',
              phone_number: data.data.phone_number || '',
              address: data.data.address || '',
              father_name: data.data.father_name || '',
              entity_type: data.data.entity_type || '',
              pan_number: data.data.pan_number || '',
              capital_commitment: data.data.capital_commitment?.toString() || '',
              resident: data.data.resident || '',
              date_of_birth: formatDateForDisplay(data.data.date_of_birth || ''),
              tax_identity_number: data.data.tax_identity_number || data.data.pan_number || '' // Use PAN as tax identity
            });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Check for empty editable required fields (only address and father_name are editable)
    const editableRequiredFields = ['address', 'father_name'];
    const emptyEditableFields = editableRequiredFields.filter(field => !userProfile[field as keyof typeof userProfile]);
    
    if (emptyEditableFields.length > 0) {
      showNotification('Please fill in the address and father\'s name fields.', 'error');
      return;
    }

    try {
      // Only send editable fields for update (address and father_name)
      const updateableFields = {
        address: userProfile.address,
        father_name: userProfile.father_name
      };

      const response = await fetch('https://api.fundos.services/api/v0/test/user/details/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...updateableFields
        }),
      });
      const data = await response.json();
      
      if (data.success || response.ok) {
        showNotification('Details Updated successfully', 'success');
        window.history.pushState({}, '', '/contribution-agreement');
        window.location.reload();
      } else {
        showNotification('Failed to update user details', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to update user details', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/professional-background');
    window.location.reload();
  };

  const handleInputChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #374151',
            borderTop: '4px solid #00fb57',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '500', color: '#FDFDFD' }}>
            Please Wait...
          </h2>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'full_name', label: 'Full Name', type: 'text', editable: false }, // Read-only - prefilled from KYCcd
    { key: 'email', label: 'Email', type: 'email', editable: false }, // Read-only
    { key: 'phone_number', label: 'Phone Number', type: 'tel', editable: false }, // Read-only
    { key: 'address', label: 'Address', type: 'textarea', editable: true }, // Editable
    { key: 'father_name', label: "Father's Name", type: 'text', editable: true }, // Editable
    { key: 'entity_type', label: 'Entity Type', type: 'text', editable: false }, // Read-only - prefilled from KYC
    { key: 'pan_number', label: 'PAN Number', type: 'text', editable: false }, // Read-only
    { key: 'capital_commitment', label: 'Capital Commitment', type: 'number', editable: false }, // Read-only - prefilled from KYC
    { key: 'resident', label: 'Resident', type: 'text', editable: false }, // Read-only - prefilled from KYC
    { key: 'date_of_birth', label: 'Date of Birth (DD/MM/YYYY)', type: 'text', editable: false } // Read-only - prefilled from KYC
    // tax_identity_number is handled internally, not shown to users like in Android app
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          User Details
        </h1>
        
        <p style={{
          color: '#bbb',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Review your KYC details. Only address and father's name can be edited. All other information is prefilled from your verification.
        </p>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key} style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#e5e7eb',
                fontSize: '0.9rem'
              }}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={userProfile[field.key as keyof typeof userProfile]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  disabled={!field.editable}
                  placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: field.editable ? '1px solid #374151' : '1px solid #4b5563',
                    background: field.editable ? '#374151' : '#4b5563',
                    color: field.editable ? 'white' : '#9ca3af',
                    outline: 'none',
                    resize: 'vertical',
                    cursor: field.editable ? 'text' : 'not-allowed'
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  value={userProfile[field.key as keyof typeof userProfile]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  disabled={!field.editable}
                  placeholder={field.editable ? `Enter ${field.label.toLowerCase()}` : ''}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: field.editable ? '1px solid #374151' : '1px solid #4b5563',
                    background: field.editable ? '#374151' : '#4b5563',
                    color: field.editable ? 'white' : '#9ca3af',
                    outline: 'none',
                    cursor: field.editable ? 'text' : 'not-allowed'
                  }}
                />
              )}
            </div>
          ))}
          
          <button 
            type="submit"
            style={{
              background: '#00fb57',
              color: '#1a1a1a',
              border: 'none',
              padding: '14px 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

// ContributionAgreement Component
const ContributionAgreement: React.FC<PageProps> = ({ showNotification }) => {
  const [checked, setChecked] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleContinue = async () => {
    if (!checked) {
      showNotification('Please confirm that you qualify as an Angel Investor before proceeding.', 'error');
      return;
    }

    try {
      const response = await fetch('https://api.fundos.services/api/v0/test/user/sign-agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agreement_signed: checked,
          user_id: userId,
        }),
      });
      const data = await response.json();
      
      if (data.success || response.ok) {
        showNotification(data.message || 'Agreement signed successfully', 'success');
        window.history.pushState({}, '', '/upload-photo');
        window.location.reload();
      } else {
        showNotification(data.message || 'Failed to sign agreement. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to sign agreement. Please try again.', 'error');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/user-details');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: '500',
          marginBottom: '16px'
        }}>
          Contribution agreement
        </h1>
        
        <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
            I am an individual investor who has net tangible assets of at least two crore rupees excluding value of my principal residence, and:
          </p>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
            1. have early-stage investment experience, or
          </p>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
            2. have experience as a serial entrepreneur, or
          </p>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
            3. am a senior management professional(s) with at least ten years of experience.
          </p>
          <p style={{ color: '#ccc', fontSize: '15px', marginBottom: '12px' }}>
            For the purpose of this clause, 'early-stage investment experience' shall mean prior experience in investing in start-up or emerging or early-stage ventures and 'serial entrepreneur' shall mean a person who has promoted or co-promoted more than one start-up venture.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '2rem',
          cursor: 'pointer'
        }} onClick={() => setChecked(!checked)}>
          <div style={{
            width: '25px',
            height: '25px',
            border: `2px solid ${checked ? '#546881' : '#B2BBC6'}`,
            background: checked ? '#546881' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}>
            {checked && <span style={{ color: 'white', fontSize: '16px' }}>✓</span>}
          </div>
          <label style={{
            color: '#ffffff',
            fontSize: '14px',
            lineHeight: '20px',
            cursor: 'pointer'
          }}>
            I confirm that I qualify as an Angel Investor based on the below condition(s)
            <span style={{ fontSize: '12px' }}>*</span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!checked}
          style={{
            background: checked ? '#00fb57' : '#666',
            color: checked ? '#1a1a1a' : '#999',
            border: 'none',
            padding: '14px 2rem',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: checked ? 'pointer' : 'not-allowed',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          Agree and continue →
        </button>
      </div>
    </div>
  );
};

// UploadPhoto Component
const UploadPhoto: React.FC<PageProps> = ({ showNotification }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      showNotification('Please select an image first', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage); // API expects 'image' field name

      const response = await fetch(`https://api.fundos.services/api/v0/test/user/upload-photo?expiration=3600&user_id=${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success || response.ok) {
        showNotification(data.message || 'Photo uploaded successfully', 'success');
        window.history.pushState({}, '', '/final-approval');
        window.location.reload();
      } else {
        showNotification(data.message || 'Failed to upload photo. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to upload photo. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/contribution-agreement');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Upload Photo
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Please upload a clear photo of yourself for verification purposes.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #374151',
              background: '#374151',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>

        {selectedImage && (
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img 
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                border: '1px solid #374151'
              }}
            />
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '0.5rem' }}>
              {selectedImage.name}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedImage || uploading}
          style={{
            background: (selectedImage && !uploading) ? '#00fb57' : '#374151',
            color: (selectedImage && !uploading) ? '#1a1a1a' : '#6b7280',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: (selectedImage && !uploading) ? 'pointer' : 'not-allowed',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </div>
  );
};

// FinalApproval Component
const FinalApproval: React.FC<PageProps> = ({ showNotification }) => {
  const handleBack = () => {
    window.history.pushState({}, '', '/upload-photo');
    window.location.reload();
  };

  const handleGoToDashboard = () => {
    showNotification('KYC process completed successfully!', 'success');
    // Add small delay to ensure notification shows before navigation
    setTimeout(() => {
      window.history.pushState({}, '', '/dashboard');
      window.location.reload();
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            alignSelf: 'flex-start'
          }}
        >
          ← Back
        </button>

        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        
        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Final Approval
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '16px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Congratulations! Your KYC process has been submitted for final approval. You will be notified once it's approved.
        </p>

        <p style={{
          color: '#9ca3af',
          fontSize: '14px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Our team will review your application and get back to you within 2-3 business days.
        </p>

        <button
          onClick={handleGoToDashboard}
          style={{
            background: '#00fb57',
            color: '#1a1a1a',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// Deal interface
interface Deal {
  deal_id: string;
  description: string;
  title: string;
  current_valuation: number;
  round_size: number;
  commitment: number;
  logo_url: string;
  minimum_investment: number;
  deal_status: 'open' | 'closed' | 'on_hold';
}

// Main Dashboard Component
const Dashboard: React.FC<PageProps> = ({ showNotification }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [investorName, setInvestorName] = useState('');
  const [userId, setUserId] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Prevent multiple API calls
    if (hasLoaded) return;

    const fetchDeals = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        showNotification('User ID not found. Please login again.', 'error');
        setHasLoaded(true);
        return;
      }
      
      setUserId(storedUserId);
      setLoading(true);

      try {
        console.log('Fetching deals for user:', storedUserId);
        const response = await fetch(`https://api.fundos.services/api/v1/live/deals/user-deals?user_id=${storedUserId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`http error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success || data.interested_deals_data) {
          setDeals(data.interested_deals_data || []);
          setInvestorName(data.user_name || '');
          showNotification('Dashboard loaded successfully', 'success');
        } else {
          // Show deals as empty but don't show error if API response is valid
          setDeals([]);
          setInvestorName(data.user_name || 'User');
          console.log('No deals available or API returned no deals');
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Set some sample data for demo purposes when API fails
        setDeals([]);
        setInvestorName('User');
        showNotification('Welcome to FundOS Dashboard', 'info');
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    };

    fetchDeals();
  }, [hasLoaded]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('email');
    localStorage.removeItem('investorType');
    localStorage.removeItem('panNumber');
    showNotification('Logged out successfully', 'success');
    window.history.pushState({}, '', '/phone-number');
    window.location.reload();
  };

  const handleViewDeal = (dealId: string) => {
    window.history.pushState({}, '', `/deal-details?dealId=${dealId}`);
    window.location.reload();
  };

  const handleTabChange = (tabLabel: string) => {
    setActiveTab(tabLabel);
    // For now, just show notification for non-home tabs
    if (tabLabel !== 'home') {
      showNotification(`${tabLabel.charAt(0).toUpperCase() + tabLabel.slice(1)} section coming soon!`, 'info');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '2rem'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #374151',
            borderTop: '4px solid #00fb57',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '500',
            color: '#FDFDFD',
            margin: '0 0 10px 0'
          }}>
            Loading Dashboard
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: 0
          }}>
            Please wait while we load your investment data...
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '2rem'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px',
              height: '75vh', // Fixed height for all tabs
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Scrollable Content */}
              <div style={{
                flex: 1,
                padding: '2rem',
                overflow: 'auto',
                paddingBottom: '1rem'
              }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h1 style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  🏠 Dashboard
                </h1>
                
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#374151',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>

              {/* Greeting */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  color: '#00fb57',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0 0 8px 0'
                }}>
                  Hey {investorName}! 👋
                </h2>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Welcome to your investment dashboard. Your KYC is complete and you're ready to explore deals!
                </p>
              </div>

              {/* Deals Section */}
              <div>
                <h3 style={{
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: '0 0 1rem 0'
                }}>
                  Available Deals
                </h3>
                
                {deals.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {deals.map((deal) => (
                      <div 
                        key={deal.deal_id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '1rem',
                          marginBottom: '1rem',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <h4 style={{
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: '0 0 8px 0'
                        }}>
                          {deal.title}
                        </h4>
                        <p style={{
                          color: '#9ca3af',
                          fontSize: '12px',
                          margin: '0 0 12px 0',
                          lineHeight: '1.4'
                        }}>
                          {deal.description}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            background: deal.deal_status === 'open' ? '#00fb57' : 
                                       deal.deal_status === 'closed' ? '#fd8888' : '#ffb800',
                            color: '#000',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {deal.deal_status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleViewDeal(deal.deal_id)}
                            style={{
                              background: '#00fb57',
                              color: '#1a1a1a',
                              border: 'none',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            View Deal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                    <h4 style={{
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 8px 0'
                    }}>
                      No Deals Available
                    </h4>
                    <p style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      We're currently preparing exciting investment opportunities for you. Check back soon!
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(0, 251, 87, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 251, 87, 0.3)',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#00fb57',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  ✅ KYC Complete - Ready to Invest!
                </p>
              </div>
              </div>

              {/* Fixed Bottom Navigation within Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '0 0 12px 12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  {[
                    { label: 'home', icon: '🏠', title: 'Home' },
                    { label: 'portfolio', icon: '💼', title: 'Portfolio' },
                    { label: 'updates', icon: '🔔', title: 'Updates' },
                    { label: 'profile', icon: '👤', title: 'Profile' }
                  ].map((tab) => {
                    const isActive = activeTab === tab.label;
                    return (
                      <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        style={{
                          background: isActive ? 'rgba(0, 251, 87, 0.2)' : 'transparent',
                          border: isActive ? '1px solid rgba(0, 251, 87, 0.4)' : '1px solid transparent',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          minWidth: '60px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          fontSize: '20px',
                          marginBottom: '2px'
                        }}>
                          {tab.icon}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: isActive ? '#00fb57' : '#9ca3af',
                          fontWeight: isActive ? '600' : '400'
                        }}>
                          {tab.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '2rem'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px',
              height: '75vh', // Fixed height for all tabs
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Scrollable Content */}
              <div style={{
                flex: 1,
                padding: '2rem',
                overflow: 'auto',
                paddingBottom: '1rem',
                textAlign: 'center'
              }}>
                <h1 style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 0 2rem 0'
                }}>
                  💼 Portfolio
                </h1>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                  <h3 style={{
                    color: '#00fb57',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0 0 1rem 0'
                  }}>
                    Portfolio Management
                  </h3>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '14px', 
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    Track your investments, view performance metrics, and manage your portfolio. Coming soon!
                  </p>
                </div>
              </div>

              {/* Fixed Bottom Navigation within Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '0 0 12px 12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  {[
                    { label: 'home', icon: '🏠', title: 'Home' },
                    { label: 'portfolio', icon: '💼', title: 'Portfolio' },
                    { label: 'updates', icon: '🔔', title: 'Updates' },
                    { label: 'profile', icon: '👤', title: 'Profile' }
                  ].map((tab) => {
                    const isActive = activeTab === tab.label;
                    return (
                      <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        style={{
                          background: isActive ? 'rgba(0, 251, 87, 0.2)' : 'transparent',
                          border: isActive ? '1px solid rgba(0, 251, 87, 0.4)' : '1px solid transparent',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          minWidth: '60px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          fontSize: '20px',
                          marginBottom: '2px'
                        }}>
                          {tab.icon}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: isActive ? '#00fb57' : '#9ca3af',
                          fontWeight: isActive ? '600' : '400'
                        }}>
                          {tab.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'updates':
        return (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '2rem'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px',
              height: '75vh', // Fixed height for all tabs
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Scrollable Content */}
              <div style={{
                flex: 1,
                padding: '2rem',
                overflow: 'auto',
                paddingBottom: '1rem',
                textAlign: 'center'
              }}>
                <h1 style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 0 2rem 0'
                }}>
                  🔔 Updates
                </h1>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📢</div>
                  <h3 style={{
                    color: '#00fb57',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0 0 1rem 0'
                  }}>
                    Latest Updates
                  </h3>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '14px', 
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    Stay informed with the latest deal updates, notifications, and important announcements. Coming soon!
                  </p>
                </div>
              </div>

              {/* Fixed Bottom Navigation within Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '0 0 12px 12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  {[
                    { label: 'home', icon: '🏠', title: 'Home' },
                    { label: 'portfolio', icon: '💼', title: 'Portfolio' },
                    { label: 'updates', icon: '🔔', title: 'Updates' },
                    { label: 'profile', icon: '👤', title: 'Profile' }
                  ].map((tab) => {
                    const isActive = activeTab === tab.label;
                    return (
                      <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        style={{
                          background: isActive ? 'rgba(0, 251, 87, 0.2)' : 'transparent',
                          border: isActive ? '1px solid rgba(0, 251, 87, 0.4)' : '1px solid transparent',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          minWidth: '60px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          fontSize: '20px',
                          marginBottom: '2px'
                        }}>
                          {tab.icon}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: isActive ? '#00fb57' : '#9ca3af',
                          fontWeight: isActive ? '600' : '400'
                        }}>
                          {tab.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '2rem'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px',
              height: '75vh', // Fixed height for all tabs
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Scrollable Content */}
              <div style={{
                flex: 1,
                padding: '2rem',
                overflow: 'auto',
                paddingBottom: '1rem',
                textAlign: 'center'
              }}>
                <h1 style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 0 2rem 0'
                }}>
                  👤 Profile
                </h1>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
                  <h3 style={{
                    color: '#00fb57',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0 0 1rem 0'
                  }}>
                    Profile Settings
                  </h3>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '14px', 
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    Manage your account settings, personal information, and preferences. Coming soon!
                  </p>
                </div>
              </div>

              {/* Fixed Bottom Navigation within Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '0 0 12px 12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  {[
                    { label: 'home', icon: '🏠', title: 'Home' },
                    { label: 'portfolio', icon: '💼', title: 'Portfolio' },
                    { label: 'updates', icon: '🔔', title: 'Updates' },
                    { label: 'profile', icon: '👤', title: 'Profile' }
                  ].map((tab) => {
                    const isActive = activeTab === tab.label;
                    return (
                      <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        style={{
                          background: isActive ? 'rgba(0, 251, 87, 0.2)' : 'transparent',
                          border: isActive ? '1px solid rgba(0, 251, 87, 0.4)' : '1px solid transparent',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          minWidth: '60px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          fontSize: '20px',
                          marginBottom: '2px'
                        }}>
                          {tab.icon}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: isActive ? '#00fb57' : '#9ca3af',
                          fontWeight: isActive ? '600' : '400'
                        }}>
                          {tab.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderTabContent()}
    </>
  );
};

const App = () => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentRoute(path);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderPage = () => {
    const pageProps = { showNotification };
    
    // Extract query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get('dealId') || '';
    const investmentAmount = urlParams.get('investmentAmount') || '';
    
    const handleBackToDashboard = () => {
      window.history.pushState({}, '', '/dashboard');
      window.location.reload();
    };
    
    const handleCommitInvestment = (dealId: string) => {
      window.history.pushState({}, '', `/commit-investment?dealId=${dealId}`);
      window.location.reload();
    };
    
    const handleTermSheet = (dealId: string, investmentAmount: string) => {
      window.history.pushState({}, '', `/term-sheet?dealId=${dealId}&investmentAmount=${investmentAmount}`);
      window.location.reload();
    };
    
    const handleBackToDeals = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const dealId = urlParams.get('dealId');
      if (dealId) {
        window.history.pushState({}, '', `/deal-details?dealId=${dealId}`);
        window.location.reload();
      } else {
        handleBackToDashboard();
      }
    };
    
    switch (currentRoute.split('?')[0]) { // Remove query parameters for route matching
      case '/phone-number':
        return <PhoneNumber {...pageProps} />;
      case '/verify-phone-otp':
        return <VerifyPhoneOTP {...pageProps} />;
      case '/email-entry':
        return <EmailEntry {...pageProps} />;
      case '/verify-email-otp':
        return <VerifyEmailOTP {...pageProps} />;
      case '/choose-investor':
        return <ChooseInvestor {...pageProps} />;
      case '/kyc-start':
        return <KYCStart {...pageProps} />;
      case '/aadhaar-verification':
        return <AadhaarVerification {...pageProps} />;
      case '/pan-verification':
        return <PANVerification {...pageProps} />;
      case '/bank-details':
        return <BankDetails {...pageProps} />;
      case '/professional-background':
        return <ProfessionalBackground {...pageProps} />;
      case '/user-details':
        return <UserDetails {...pageProps} />;
      case '/contribution-agreement':
        return <ContributionAgreement {...pageProps} />;
      case '/upload-photo':
        return <UploadPhoto {...pageProps} />;
      case '/final-approval':
        return <FinalApproval {...pageProps} />;
      case '/dashboard':
        return <Dashboard {...pageProps} />;
      case '/deal-details':
        return (
          <DealDetails 
            dealId={dealId}
            showNotification={showNotification}
            onBack={handleBackToDashboard}
            onCommit={handleCommitInvestment}
          />
        );
      case '/commit-investment':
        return (
          <CommitInvestment
            dealId={dealId}
            showNotification={showNotification}
            onBack={handleBackToDeals}
            onTermSheet={handleTermSheet}
          />
        );
      case '/term-sheet':
        return (
          <div style={{
            minHeight: '100vh',
            background: '#1a1a1a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <h1>Term Sheet</h1>
              <p style={{ margin: '1rem 0', color: '#ccc' }}>
                Deal ID: {dealId}<br />
                Investment Amount: ₹{investmentAmount}
              </p>
              <p style={{ color: '#999', fontSize: '14px', margin: '1rem 0' }}>
                Term sheet functionality coming soon!
              </p>
              <button
                onClick={handleBackToDeals}
                style={{
                  background: '#00fb57',
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back to Deal Details
              </button>
            </div>
          </div>
        );
      case '/':
      case '/get-started':
      default:
        return <GetStarted />;
    }
  };

  return (
    <>
      {renderPage()}
      <NotificationContainer />
    </>
  );
};

export default App;
