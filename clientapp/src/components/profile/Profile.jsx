import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ItemPropsContext } from '../../context/itemPropsContext';

import "./profile.css";

const Profile = () => {
  const { decodedToken, setFirstName } = useContext(ItemPropsContext);

  const [selectedNav, setSelectedNav] = useState('profile')

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('firstName')
    localStorage.setItem('cartCount', 0)
    setFirstName('')
    window.location.replace(`${window.location.origin}/login`)
  }

  return (
    <div>
      <div className="container profile-container">
        <div className="row">
          <div className="col-md-2 navigation-col">
            <div className="navigation d-flex flex-column text-center">
              {decodedToken && <Link to={`/account/profile/${decodedToken.userId}`} onClick={() => setSelectedNav('profile')} className={`nav-item border-bottom py-2 mb-1 text-decoration-none ${selectedNav === 'profile' ? 'text-white bg-gold shadow' : 'text-dim'}`}>Profile</Link>}
              {decodedToken && <Link to={`/account/loyalty-status/${decodedToken.userId}`} onClick={() => setSelectedNav('loyalty')} className={`nav-item border-bottom py-2 mb-1 text-decoration-none ${selectedNav === 'loyalty' ? 'text-white bg-gold shadow' : 'text-dim'}`}>Loyalty Status</Link>}
              <Link to="/account/notifications" onClick={() => setSelectedNav('notification')} className={`nav-item border-bottom py-2 mb-1 text-decoration-none ${selectedNav === 'notification' ? 'text-white bg-gold shadow' : 'text-dim'}`}>Notifications</Link>
              <Link to="/account/messages" onClick={() => setSelectedNav('messages')} className={`nav-item border-bottom py-2 mb-1 text-decoration-none ${selectedNav === 'messages' ? 'text-white bg-gold shadow' : 'text-dim'}`}>Message Support</Link>
              <Link to="/appointment" className="nav-item border-bottom py-2 mb-1 text-decoration-none text-dim">Set Appointment</Link>
              <Link to="/cart" className="nav-item border-bottom py-2 mb-1 text-decoration-none text-dim">Cart</Link>
              <Link to="/transactions" className="nav-item border-bottom py-2 text-decoration-none text-dim">Transactions</Link>
              <div className="nav-item border-bottom py-2 text-decoration-none text-dim mont-regular" onClick={() => signOut()}>Sign Out</div>
            </div>
          </div>
          <div className="col-md-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
