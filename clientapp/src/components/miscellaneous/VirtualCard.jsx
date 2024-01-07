import AGOYLogo from '../../assets/AGOYwhite.svg'
import backgroundCard from '../../assets/download.svg'

import './virtual-card.css'

const VirtualCard = ({ loyaltyInfo, setDisplayed }) => {
  return (
    <div className="Virtual-Card Wrap">
      <div className="Base">
        <div className="Inner-wrap shadow-lg pe-none" style={{ backgroundImage: `url(${backgroundCard})` }}>
          {/* Header SVG */}
          <div className='Logo-name'></div>
          {/* <svg
            className="Logo-name"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.0"
            width="298.72266"
            height="55.51717"
          >
            Include your SVG path elements here
          </svg> */}

          {/* Logo SVG */}
          <div className='Logo'></div>
          {/* <svg
            className="Logo"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 97.814 97.063"
          >
            Include your SVG path elements here
          </svg> */}

          {/* Card Chip SVG */}
          <div className='text-center mt-4'>
            {<img src={AGOYLogo} className='Chip' />}
          </div>
          {/* <svg
            className="Chip"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 387.8 380.3"
          > */}
            {/* Include your SVG path elements here */}
          {/* </svg> */}

          <div className="Card-number">
            <ul>
              <li>{loyaltyInfo.membershipNumber}</li>
              {/* <li id="first-li">4351</li>
              <li>8237</li>
              <li>2189</li>
              <li id="last-li">0104</li> */}
            </ul>
          </div>
          
          <div className="Expire">
            <h4 className='mont-bold text-white'>{loyaltyInfo.loyaltyTier}</h4>
            <p className='cursor-pointer' onClick={() => setDisplayed('display-history')}>Current Points: {loyaltyInfo.currentPoints}</p>
          </div>

          <div className="Name mt-3">
            <h3>{loyaltyInfo.firstName} {loyaltyInfo.lastName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
