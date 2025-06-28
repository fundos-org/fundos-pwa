import React, { useState, useEffect } from 'react';

const ChooseInvestor: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user_id from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const options = [
    {
      value: 'individual',
      label: 'Individual Investor',
      description: "I'm investing as a person using my personal capital",
    },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleNext = async () => {
    console.log('handleNext called with value:', selectedValue);
    
    if (!selectedValue) {
      alert('Please select an investor type');
      return;
    }

    if (!userId) {
      alert('User ID not found. Please login again.');
      return;
    }

    try {
      const response = await fetch('http://43.205.36.168/api/v0/test/user/choose-investor-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investor_type: selectedValue,
          user_id: userId,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data) {
        console.log('API response:', data);
        setIsModalVisible(true);
      } else {
        console.error('API error:', data);
        alert('Failed to choose investor type. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to choose investor type. Please try again.');
    }
  };

  const handleDeclaration = async () => {
    if (!isChecked) {
      alert('Please confirm that you qualify as an Angel Investor before proceeding.');
      return;
    }

    try {
      const response = await fetch('http://43.205.36.168/api/v0/test/user/declaration', {
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
          alert(data.message);
        }
        setIsModalVisible(false);
        // Navigate to KYC Start Screen
        window.history.pushState({}, '', '/kyc-start');
        window.location.reload();
      } else {
        console.error('Declaration API error:', data);
        alert('Failed to apply for declarations. Please try again.');
      }
    } catch (error) {
      console.error('Declaration network error:', error);
      alert('Failed to apply for declarations. Please try again.');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/verify-email-otp');
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: 'white',
      padding: '20px'
    }}>
      <div>
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
          Choose investor type
        </h1>
        
        <p style={{
          color: '#00ffcc',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          Make sure you select a correct type.
        </p>

        <div style={{ marginBottom: '30px' }}>
          {options.map((option) => (
            <div 
              key={option.value}
              onClick={() => handleRadioChange(option.value)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px',
                marginBottom: '15px',
                border: selectedValue === option.value ? '2px solid #00ffcc' : '1px solid #333',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedValue === option.value ? 'rgba(0, 255, 204, 0.1)' : 'transparent'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #546881',
                marginRight: '15px',
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedValue === option.value ? '#546881' : 'transparent'
              }}>
                {selectedValue === option.value && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'white'
                  }} />
                )}
              </div>
              <div>
                <h3 style={{
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0'
                }}>
                  {option.label}
                </h3>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedValue && (
        <button
          onClick={handleNext}
          style={{
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '500',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Next
        </button>
      )}

      {/* Modal */}
      {isModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#242325',
            padding: '20px',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '600px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalVisible(false)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '30px',
                height: '40px',
                width: '40px',
                border: '1px solid #383739',
                backgroundColor: 'transparent',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            <h2 style={{
              color: '#fff',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Declaration
            </h2>

            <p style={{
              color: '#fff',
              fontSize: '16px',
              marginBottom: '10px',
              lineHeight: '25px'
            }}>
              I am an individual investor who has net tangible assets of at least two crore rupees excluding value of my principal residence, and:
            </p>

            <div style={{ marginBottom: '30px' }}>
              <p style={{ color: '#fff', fontSize: '14px', lineHeight: '25px' }}>
                1. have early-stage investment experience, or
              </p>
              <p style={{ color: '#fff', fontSize: '14px', lineHeight: '25px' }}>
                2. have experience as a serial entrepreneur, or
              </p>
              <p style={{ color: '#fff', fontSize: '14px', lineHeight: '25px' }}>
                3. am a senior management professional(s) with at least ten years of experience.
              </p>
            </div>

            <div 
              onClick={() => setIsChecked(!isChecked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '15px',
                padding: '10px',
                gap: '15px'
              }}
            >
              <div style={{
                width: '25px',
                height: '25px',
                border: `2px solid ${isChecked ? '#546881' : '#B2BBC6'}`,
                backgroundColor: isChecked ? '#546881' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isChecked && (
                  <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                )}
              </div>
              <p style={{
                color: '#ffffff',
                fontSize: '14px',
                lineHeight: '20px',
                margin: 0
              }}>
                I confirm that I qualify as an Angel Investor<br />
                based on the above condition(s)<span style={{ fontSize: '12px' }}>*</span>
              </p>
            </div>

            <button
              onClick={handleDeclaration}
              disabled={!isChecked}
              style={{
                backgroundColor: isChecked ? '#fff' : '#666',
                color: isChecked ? '#000' : '#fff',
                border: 'none',
                padding: '13px 20px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '4px',
                cursor: isChecked ? 'pointer' : 'not-allowed',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              Agree and continue
              <span style={{ fontSize: '20px' }}>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseInvestor;
