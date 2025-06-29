import React from "react";

interface TermSheetProps {
  onBack: () => void;
}

const TermSheet: React.FC<TermSheetProps> = ({ onBack }) => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      boxSizing: 'border-box'
    }}>
      {/* Back Icon */}
      <button 
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          fontSize: '2rem',
          cursor: 'pointer',
          padding: '1rem',
          alignSelf: 'flex-start',
          zIndex: 10
        }}
      >
        ←
      </button>
      
      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto',
        paddingBottom: '6rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: '0 0 2rem 0'
        }}>
          📄 Term Sheet
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#00fb57',
            fontSize: '1.4rem',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            Investment Terms & Conditions
          </h2>
          
          <div style={{
            color: '#ccc',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              This term sheet outlines the key terms and conditions for your investment in the selected deal. 
              Please review all details carefully before proceeding.
            </p>
            
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '1.5rem 0 0.5rem 0'
            }}>
              Key Investment Terms:
            </h3>
            
            <ul style={{
              margin: '0.5rem 0',
              paddingLeft: '1.5rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Investment Amount:</strong> As specified in your commitment
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Management Fee:</strong> Applicable percentage as per fund terms
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Lock-in Period:</strong> Minimum holding period applies
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Exit Terms:</strong> Subject to fund exit strategy and market conditions
              </li>
            </ul>
            
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '1.5rem 0 0.5rem 0'
            }}>
              Risk Disclosure:
            </h3>
            
            <p style={{
              color: '#ef4444',
              fontSize: '13px',
              fontStyle: 'italic',
              marginBottom: '1rem'
            }}>
              Investment in private equity involves significant risks including but not limited to 
              illiquidity, potential loss of capital, and market volatility. Past performance 
              does not guarantee future returns.
            </p>
            
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '1.5rem 0 0.5rem 0'
            }}>
              Regulatory Compliance:
            </h3>
            
            <p style={{ marginBottom: '1rem' }}>
              This investment is subject to applicable securities laws and regulations. 
              Investors must meet eligibility criteria as per regulatory requirements.
            </p>
          </div>
          
          <div style={{
            background: 'rgba(0, 251, 87, 0.1)',
            border: '1px solid rgba(0, 251, 87, 0.3)',
            
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <p style={{
              color: '#00fb57',
              fontSize: '13px',
              fontWeight: '600',
              margin: 0,
              textAlign: 'center'
            }}>
              ⚠️ Please ensure you have read and understood all terms before proceeding
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              padding: '14px 24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.3s ease'
            }}
          >
            Back
          </button>
          <button
            style={{
              backgroundColor: '#00fb57',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '600',
              padding: '14px 24px',
              border: 'none',
              
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.3s ease'
            }}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermSheet;
