import { useEffect, useState, lazy, Suspense } from 'react'; // Import lazy and Suspense
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import { ItemPropsContext } from './context/itemPropsContext';

import './styles.css';
import ScrollToTop from './hooks/ScrollTop';
import LoadingComponent from './utils/LoadingComponent';

// Lazy load the components
const Home = lazy(() => import('./components/home/Home'));
const ShopCategories = lazy(() => import('./components/shop-categories/ShopCategories'));
const NavBar = lazy(() => import('./components/navbar/NavBar'));
const ShopList = lazy(() => import('./components/shop-list/ShopList'));
const Product = lazy(() => import('./components/product/Product'));
const About = lazy(() => import('./components/about/About'));
const Footer = lazy(() => import('./components/footer/Footer'));
const Login = lazy(() => import('./components/login/Login'));
const Register = lazy(() => import('./components/register/Register'));
const AddProductForm = lazy(() => import('./components/addProductForm/AddProductForm'));
const Cart = lazy(() => import('./components/cart/Cart'));
const CheckoutConfirmation = lazy(() => import('./components/checkout-confirmation/CheckoutConfirmation'));
const Profile = lazy(() => import('./components/profile/Profile'));
const ContactUs = lazy(() => import('./components/contact-us/ContactUs'));
const Checkout = lazy(() => import('./components/checkout/Checkout'));
const Payment = lazy(() => import('./components/payment/Payment'));
const Transaction = lazy(() => import('./components/transaction/Transaction'));
const TransactionDetails = lazy(() => import('./components/transaction-details/TransactionDetails'));
const ForgotPassword = lazy(() => import('./components/forgot-password/ForgotPassword'));
const EmailVerify = lazy(() => import('./components/email-verify/EmailVerify'));
const ProfileUserInfo = lazy(() => import('./components/profile/ProfileUserInfo'));
const ProfileLoyalty = lazy(() => import('./components/profile/ProfileLoyalty'));
const ReferenceTracker = lazy(() => import('./components/reference-tracker/ReferenceTracker'));
const StripeComponent = lazy(() => import('./components/stripe-form/StripeComponent'));
const Notification = lazy(() => import('./components/notifications/Notification'));
const Appointment = lazy(() => import('./components/appointment/Appointment'));
const Messages = lazy(() => import('./components/messages/Messages'));
const Education = lazy(() => import('./components/education/Education'));
const Philosophy = lazy(() => import('./components/philosophy/Philosophy'));
const Policy = lazy(() => import('./components/policies/Policy'));
const Library = lazy(() => import('./components/library/Library'));
const LibraryContent = lazy(() => import('./components/library-content/LibraryContent'));
const PrivateRoutes = lazy(() => import('./utils/PrivateRoutes'));

function App() {
  const [displayDropdown, setDisplayDropdown] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [cartCount, setCartCount] = useState();

  const token = localStorage.getItem('token');
  const { decodedToken, isExpired } = useJwt(token);

  const valueToPass = {
    displayDropdown,
    setDisplayDropdown,
    firstName,
    setFirstName,
    cartCount,
    setCartCount,
    token,
    decodedToken
  };

  useEffect(() => {
    if (isExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('firstName')
      localStorage.setItem('cartCount', 0)
      setFirstName('')
      setCartCount()
      return;
    }
    if (token) {
      setFirstName(localStorage.getItem('firstName'));
      setCartCount(localStorage.getItem('cartCount'));
    }
    else {
      if (!localStorage.getItem('guestCart'))
      {
        localStorage.setItem('guestCart', '[]')
        localStorage.setItem('cartCount', 0)
      }
    }
  }, [decodedToken, isExpired, setFirstName]);

  return (
    <Router>
      <ScrollToTop />
      <ItemPropsContext.Provider value={valueToPass}>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Suspense fallback={<LoadingComponent />}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<LoadingComponent />}><Register /></Suspense>} />
          <Route path="/" element={<Suspense fallback={<LoadingComponent />}><Home /></Suspense>} />
          <Route path="/shop" element={<Suspense fallback={<LoadingComponent />}><ShopCategories /></Suspense>} />
          <Route path="/shop/:group/filter/:category" element={<Suspense fallback={<LoadingComponent />}><ShopList /></Suspense>} />
          <Route path="/shop/:group/:product" element={<Suspense fallback={<LoadingComponent />}><Product /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<LoadingComponent />}><About /></Suspense>} />
          <Route path="/education" element={<Suspense fallback={<LoadingComponent />}><Education /></Suspense>} />
          <Route path="/philosophy" element={<Suspense fallback={<LoadingComponent />}><Philosophy /></Suspense>} />
          <Route path="/add" element={<Suspense fallback={<LoadingComponent />}><AddProductForm /></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<LoadingComponent />}><Cart /></Suspense>} />
          <Route path="/process" element={<Suspense fallback={<LoadingComponent />}><CheckoutConfirmation /></Suspense>} />
          <Route element={<Suspense fallback={<LoadingComponent />}><PrivateRoutes decodedToken={token} /></Suspense>}>
            <Route path="/account/" element={<Suspense fallback={<LoadingComponent />}><Profile /></Suspense>}>
              <Route path="profile/:userId" element={<Suspense fallback={<LoadingComponent />}><ProfileUserInfo /></Suspense>} />
              <Route path="loyalty-status/:userId" element={<Suspense fallback={<LoadingComponent />}><ProfileLoyalty /></Suspense>} />
              <Route path="notifications" element={<Suspense fallback={<LoadingComponent />}><Notification /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={<LoadingComponent />}><Messages /></Suspense>} />
            </Route>
            <Route path="/email-verification" element={<Suspense fallback={<LoadingComponent />}><EmailVerify /></Suspense>} />
            <Route path="/appointment" element={<Suspense fallback={<LoadingComponent />}><Appointment /></Suspense>} />
          </Route>
          <Route path="/contact-us" element={<Suspense fallback={<LoadingComponent />}><ContactUs /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<LoadingComponent />}><Checkout /></Suspense>} />
          <Route path="/payment" element={<Suspense fallback={<LoadingComponent />}><Payment /></Suspense>} />
          <Route path="/transactions" element={<Suspense fallback={<LoadingComponent />}><Transaction /></Suspense>} />
          <Route path="/transactions/:transactionId" element={<Suspense fallback={<LoadingComponent />}><TransactionDetails /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<LoadingComponent />}><ForgotPassword /></Suspense>} />
          <Route path="/reference-tracker" element={<Suspense fallback={<LoadingComponent />}><ReferenceTracker /></Suspense>} />
          <Route path="/stripe-component" element={<Suspense fallback={<LoadingComponent />}><StripeComponent /></Suspense>} />
          <Route path="/policy/:selectedPolicy" element={<Suspense fallback={<LoadingComponent />}><Policy /></Suspense>} />
          <Route path="/library" element={<Suspense fallback={<LoadingComponent />}><Library /></Suspense>} />
          <Route path="/library/:librarycontent" element={<Suspense fallback={<LoadingComponent />}><LibraryContent /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </ItemPropsContext.Provider>
    </Router>
  );
}

export default App;
