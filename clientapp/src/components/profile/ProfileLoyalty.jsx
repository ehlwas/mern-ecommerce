import { useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ItemPropsContext } from "../../context/itemPropsContext";
import axios from "axios";

import { AiOutlineRight } from 'react-icons/ai'
import ProfileLoyaltyCoin from "./ProfileLoyaltyCoin";
import VirtualCard from "../miscellaneous/VirtualCard";

const ProfileLoyalty = () => {
  const { token } = useContext(ItemPropsContext)

  const { userId } = useParams()

  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loyaltyInfo, setLoyaltyInfo] = useState()
  const [displayed, setDisplayed] = useState('display-loyalty')

  const getLoyalty = async () => {
    const config = {
      headers: {
        'x-access-token': token
      }
    }

    await axios.get(`/api/loyalty/`, config)
    .then(response => {
      setLoyaltyInfo(response.data)
      setLoyaltyPoints(response.data)
    }).catch(err => console.log(err))
  }

  useEffect(() => {
    getLoyalty()
  }, [])
  return (
    <div className="mt-3 bg-white shadow my-3 px-3">
      {displayed === 'display-loyalty' ? (
        <div className="py-5">
          {loyaltyInfo && <VirtualCard loyaltyInfo={loyaltyInfo} setDisplayed={setDisplayed} />}
          <div className="row mt-5">
            <div className="col text-center">
              <button className="btn-gold p-3 w-50" onClick={() => setDisplayed('display-history')}>Points History</button>
            </div>
          </div>
        </div>
      ) : (
        <ProfileLoyaltyCoin setDisplayed={setDisplayed} loyaltyPoints={loyaltyPoints} />
      )}
      
    </div>
  )
};

export default ProfileLoyalty;