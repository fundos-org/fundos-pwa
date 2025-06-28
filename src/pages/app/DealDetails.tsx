import React, { useState, useEffect } from 'react';

interface Deal {
  deal_id: string;
  description: string;
  title: string;
  current_valuation: number;
  round_size: number;
  minimum_investment: number;
  commitment: number;
  instruments: string;
  fund_raised_till_now: number;
  logo_url: string;
  management_fee: number;
  company_stage: string;
  carry: number;
  business_model: string;
}

interface DealDetailsProps {
  dealId: string;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  onBack: () => void;
  onCommit: (dealId: string) => void;
}

const DealDetails: React.FC<DealDetailsProps> = ({ dealId, showNotification, onBack, onCommit }) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://43.205.36.168/api/v1/live/deals/?deal_id=${dealId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch deal details');
        }
        
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error('Error fetching deal details:', error);
        showNotification('Failed to load deal details. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId, showNotification]);

  const convertToCrores = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} L`;
    } else {
      return `${value.toLocaleString('en-IN')}`;
    }
  };

  const handleCommit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('User not authenticated', 'error');
        return;
      }

      // Check MCA status first
      const mcaResponse = await fetch(`https://43.205.36.168/api/v1/live/deals/mca/status?user_id=${userId}`);
      
      if (!mcaResponse.ok) {
        throw new Error('Failed to check MCA status');
      }
      
      const mcaData = await mcaResponse.json();
      
      if (mcaData?.message) {
        showNotification(mcaData.message, 'success');
      }
      
      if (mcaData.sent_status === 'success' && mcaData.request_status === 'completed') {
        onCommit(dealId);
      } else if (mcaData.sent_status === 'success' && mcaData.request_status === 'inprogress') {
        showNotification('Signing Docs in progress. Please contact admin.', 'error');
      } else {
        showNotification('Ask your fund manager to sign the docs!', 'error');
      }
    } catch (error) {
      console.error('Error in commit process:', error);
      showNotification('Failed to apply for declarations. Please try again.', 'error');
    }
  };

  const handleNotInterested = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        showNotification('User not authenticated', 'error');
        return;
      }

      const response = await fetch(`https://43.205.36.168/api/v1/live/deals/interaction?deal_id=${dealId}&user_id=${userId}&not_interested=true`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to set not interested');
      }
      
      const data = await response.json();
      
      if (data?.message) {
        showNotification(data.message, 'success');
      }
      
      onBack(); // Go back to dashboard
    } catch (error) {
      console.error('Error setting not interested:', error);
      showNotification('Failed to set not interested. Please try again.', 'error');
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
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
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#FDFDFD',
            margin: '0 0 10px 0'
          }}>
            Loading Deal Details
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: 0
          }}>
            Please wait while we fetch the deal information...
          </p>
        </div>
      </div>
    );
  }

  if (!deal) {
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
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#FDFDFD',
            margin: '0 0 20px 0'
          }}>
            Deal Not Found
          </h2>
          <button
            onClick={onBack}
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
            Back to Dashboard
          </button>
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
        backdropFilter: 'blur(10px)',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <button 
          onClick={onBack}
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
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: '0 0 1rem 0'
        }}>
          {deal.title}
        </h1>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{
            color: '#ccc',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.5',
            display: isDescriptionExpanded ? 'block' : '-webkit-box',
            WebkitLineClamp: isDescriptionExpanded ? 'none' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {deal.description}
          </p>
          {deal.description && deal.description.length > 150 && (
            <button
              onClick={toggleDescription}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00fb57',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '0',
                marginTop: '8px'
              }}
            >
              {isDescriptionExpanded ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Deal Details Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            📊 Deal Information
          </h2>

          {/* Current Valuation - Featured */}
          <div style={{ 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(0, 251, 87, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(0, 251, 87, 0.3)'
          }}>
            <p style={{
              color: '#00fb57',
              fontSize: '12px',
              margin: '0 0 4px 0',
              fontWeight: '600'
            }}>
              CURRENT VALUATION
            </p>
            <p style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0'
            }}>
              INR {convertToCrores(deal.current_valuation)}{' '}
              <span style={{
                color: '#9ca3af',
                fontSize: '1rem',
                fontWeight: 'normal'
              }}>
                (Post)
              </span>
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                STAGE
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {deal.company_stage?.toUpperCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                INSTRUMENT
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                {deal.instruments?.toUpperCase() || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                ROUND SIZE
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                INR {convertToCrores(deal.round_size)}
              </p>
            </div>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                MIN. INVESTMENT
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                INR {convertToCrores(deal.minimum_investment)}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                COMMITMENTS
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                INR {convertToCrores(deal.commitment)}
              </p>
            </div>
            <div>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0 0 4px 0',
                fontWeight: '600'
              }}>
                VALUATION
              </p>
              <p style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0'
              }}>
                INR {convertToCrores(2500000)}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <p style={{
              color: '#00fb57',
              fontSize: '14px',
              margin: '0 0 8px 0',
              fontWeight: '600'
            }}>
              📈 {deal.fund_raised_till_now}% funds raised till now
            </p>
            <div style={{
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00fb57 0%, #00d647 100%)',
                width: `${deal.fund_raised_till_now}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={handleCommit}
            style={{
              backgroundColor: '#00fb57',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            💰 Commit Investment
          </button>
          <button
            onClick={handleNotInterested}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Not Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
