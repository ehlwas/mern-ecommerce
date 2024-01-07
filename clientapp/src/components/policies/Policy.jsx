import { Link, useParams } from "react-router-dom"
import TermsAndConditions from "./TermsAndConditions"

import './policy.css'
import ReturnsAndExchanges from "./ReturnsAndExchanges"
import CookiePolicy from "./CookiesPolicy"
import PrivacyPolicy from "./PrivacyPolicy"
import LoyaltyProgram from "./LoyaltyProgram"
const Policy = () => {
    const { selectedPolicy } = useParams()

    const displayedPolicy = () => {
        if (selectedPolicy === 'termsandconditions') {
            return <TermsAndConditions />
        } else if (selectedPolicy === 'returnandexchange') {
            return <ReturnsAndExchanges />
        } else if (selectedPolicy === 'cookiepolicy') {
            return <CookiePolicy />
        } else if (selectedPolicy === 'privacypolicy') {
            return <PrivacyPolicy />
        } else if (selectedPolicy === 'loyaltyprogram') {
            return <LoyaltyProgram />
        }
    }

    return (
        <div className="container my-4 text-gold">
            <div className="row">
                <div className="col-8">
                    {displayedPolicy()}
                </div>
                <div className="col-4">
                    <ul className="list-group policy-menu">
                        <li className="list-group-item border-0">
                            <Link to="/policy/termsandconditions" className="text-gold">Terms & Condition</Link>
                        </li>
                        <li className="list-group-item border-0">
                            <Link to="/policy/returnandexchange" className="text-gold">Returns & Exchange</Link>
                        </li>
                        <li className="list-group-item border-0">
                            <Link to="/policy/cookiepolicy" className="text-gold">Cookie Policy</Link>
                        </li>
                        <li className="list-group-item border-0">
                            <Link to="/policy/privacypolicy" className="text-gold">Privacy Policy</Link>
                        </li>
                        <li className="list-group-item border-0">
                            <Link to="/policy/loyaltyprogram" className="text-gold">Loyalty Program</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Policy