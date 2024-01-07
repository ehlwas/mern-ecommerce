import { useEffect, useState, useContext } from "react"
import { AiOutlineLeft } from 'react-icons/ai'
import { ItemPropsContext } from "../../context/itemPropsContext";

import LoyaltyPointsLogo from '../../assets/logos/loyaltyPointsLogo.png'
import axios from "axios";
import { Link } from "react-router-dom";

const ProfileLoyaltyCoin = ({ setDisplayed, loyaltyPoints }) => {
  const { token } = useContext(ItemPropsContext)

  const [selectedFilter, setSelectedFilter] = useState('All')
  const [pointsList, setPointsList] = useState()

  const getPointsList = async () => {
    setPointsList()

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    await axios.get(`/api/points/filter=${selectedFilter}`, config)
    .then(response => {
      setPointsList(response.data)
    }).catch(err => console.log(err))
  }

  const convertDateToString = (date) => {
    const newDate = new Date(date)

    return newDate.toLocaleDateString()
  }

  useEffect(() => {
    getPointsList()
  }, [selectedFilter])

  return (
    <>
      <div className="row align-items-center pt-1 mb-2 text-gold">
        <div className="col-1 cursor-pointer back-button py-2" onClick={() => setDisplayed('display-loyalty')}><AiOutlineLeft className="mb-2" /></div>
        <div className="col-1">
          <img src={LoyaltyPointsLogo} className="loyalty-points-logo" alt="Loyalty Points" width="50px" />
        </div>
        <div className="col points-header">
          <h5 className="mb-0">{loyaltyPoints.currentPoints} Current Points</h5>
          <h5 className="mb-0">{loyaltyPoints.totalPoints} Total Points</h5>
        </div>
      </div>
      <div className="row border-bottom border-top text-center points-filter align-items-center text-dim">
        <div className="col p-0" onClick={() => setSelectedFilter('All')}>
          <div className={`icon-text p-3 ${selectedFilter === 'All' ? 'bg-gold text-white' : ''}`}>All History</div>
        </div>
        <div className="col p-0" onClick={() => setSelectedFilter('Earned')}>
          <div className={`icon-text p-3 ${selectedFilter === 'Earned' ? 'bg-gold text-white' : ''}`}>Earning</div>
        </div>
        <div className="col p-0" onClick={() => setSelectedFilter('Spend')}>
          <div className={`icon-text p-3 ${selectedFilter === 'Spend' ? 'bg-gold text-white' : ''}`}>Spending</div>
        </div>
      </div>

      {pointsList &&
        pointsList.map(item => {
          return (
            item.pointsType === 'Earned' ? (
              <div className="row py-3 align-items-center border-bottom text-dim">
                <div className="col">
                  <h5>Earned: {item.transactionReferenceNumber}</h5>
                  <p className="m-0">Expires on {convertDateToString(item.pointsExpiration)}</p>
                </div>
                <div className="col text-end">
                  <h4 className="m-0">+{item.points}</h4>
                </div>
              </div>
            ) : (
              item.pointsType === 'Spend' ? (
                <div className="row py-3 align-items-center border-bottom text-dim">
                  <div className="col">
                    <h5>{item.transactionReferenceNumber}</h5>
                    <p className="m-0">Spent on {convertDateToString(item.createdAt)}</p>
                  </div>
                  <div className="col text-end">
                    <h4 className="m-0">-{item.points}</h4>
                  </div>
                </div>
              ) : (
                <div className="row py-3 align-items-center border-bottom text-dim">
                  <div className="col">
                    <h5>Points Expired from {item.transactionReferenceNumber}</h5>
                    <p className="m-0">{convertDateToString(item.createdAt)}</p>
                  </div>
                  <div className="col text-end">
                    <h4 className="m-0">-{item.points}</h4>
                  </div>
                </div>
              )
            )
          )
        })}
    </>
  )
}

export default ProfileLoyaltyCoin