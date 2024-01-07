import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ItemPropsContext } from '../../context/itemPropsContext'

import {FaFacebookF} from 'react-icons/fa'
import {FiInstagram} from 'react-icons/fi'
import {IoLogoTwitter} from 'react-icons/io'
import {IoLogoYoutube} from 'react-icons/io'
import {BsWhatsapp} from 'react-icons/bs'

import AGOYLogo from '../../assets/AGOY.svg'

import './footer.css'

const Footer = () => {
    const { displayDropdown } = useContext(ItemPropsContext)
    return (
        <footer className={`${!displayDropdown ? "display-hidden" : ""} shadow-lg`}>
          <div className='footer-container'>
            <div className="row footer-row">
              <div className="col-4">
                <Link to="/" className='footer__logo'>
                  <img src={AGOYLogo} alt='Logo Image' width='150px' />
                </Link>
              </div>
              <div className="col footer-col text-dim">
                <bold className="text-gold">PRODUCTS</bold>
                <hr />
                <p className='mb-0'>CATEGORIES</p>
                <p className='mb-0'><Link to="/shop/Pre-Sleep" className='text-decoration-none'>-PRE-SLEEP</Link></p>
                <p className='mb-0'><Link to="/shop/Sleep" className='text-decoration-none'>-SLEEP</Link></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-POST-SLEEP</a></p>
              </div>
              <div className="col footer-col">
                <bold className="text-gold">ACCOUNT</bold>
                <hr />
                <p className='mb-0'><Link to="/account" className='text-decoration-none'>-PROFILE</Link></p>
                <p className='mb-0'><Link to="/shop/Sleep" className='text-decoration-none'>-CART</Link></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-TRANSACTIONS</a></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-TRACK DELIVERY</a></p>
              </div>
              {/* <div className="col footer-col">
                <bold>ABOUT US</bold>
                <hr />
                <p className='mb-0'><Link to="/account" className='text-decoration-none'>-ABOUT US</Link></p>
                <p className='mb-0'><Link to="/shop/Sleep" className='text-decoration-none'>-EDUCATION</Link></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-BLOG</a></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-PARTNERS</a></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-ACTIVITIES</a></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-LOCATION</a></p>
                <p className='mb-0'><a href='#' className='text-decoration-none'>-CONTACT US</a></p>
              </div> */}
              <div className="col footer-col">
                <bold className="text-gold">WEBSITE</bold>
                <hr />
                <p className='mb-0'><Link to="/policy/termsandconditions" className=''>-Terms & Condition</Link></p>
                <p className='mb-0'><a href='#' className=''>-Returns & Exchange</a></p>
                <p className='mb-0'><a href='#' className=''>-Cookie Policy</a></p>
                <p className='mb-0'><a href='#' className=''>-Privacy Policy</a></p>
                <p className='mb-0'><a href='#' className=''>-Loyalty Program</a></p>
              </div>
            </div>
      
            <div className="footer__socials">
                <a href="https://www.facebook.com/profile.php?id=100077168439091" className='bg-dim text-white'><FaFacebookF/></a>
                <a href="https://www.instagram.com/agoysleep/" className='bg-dim text-white'><FiInstagram/></a>
                <a href="#" className='bg-dim text-white'><IoLogoTwitter/></a>
                <a href="#" className='bg-dim text-white'><IoLogoYoutube/></a>
                <a href="https://wa.me/123456789" target="_blank" className='bg-dim text-white' rel="noreferrer"><BsWhatsapp/></a>
            </div>

            <hr />

            <div className="footer__copyright text-dim mont-regular">
              <p className='mb-0'>
                <small>&copy; AGOY. ALL RIGHT RESERVED.</small>
                {/* <Link to="/policy/termsandconditions" className='ml-3'>Terms & Condition</Link>
                <a href='#' className='ml-3'>Returns & Exchange</a>
                <a href='#' className='ml-3'>Cookie Policy</a>
                <a href='#' className='ml-3'>Privacy Policy</a>
                <a href='#' className='ml-3'>Loyalty Program</a> */}
              </p>
            </div>
          </div>
        </footer>    
    )
}

export default Footer