import { useContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemPropsContext } from '../../context/itemPropsContext'
import { TRANSACTION_STATE, transactionReducer } from '../../reducers/transactionReducer';
import axios from 'axios'
import { AiOutlineArrowRight } from 'react-icons/ai'

import { DotSpinner } from '@uiball/loaders'

import './transaction.css'

const Transaction = () => {
  const { token } = useContext(ItemPropsContext)

  const [transactionState, transactionDispatch] = useReducer(transactionReducer, TRANSACTION_STATE)

  const [selectedFilter, setSelectedFilter] = useState('All')

  const getTransactionList = async () => {
    transactionDispatch({ type: "FETCH_START" })

    const config = {
      headers: {
        'x-access-token': token
      }
    }

    let setFilter = 'all'

    if (selectedFilter === 'Pending') {
      setFilter = 'pending'
    }
    else if (selectedFilter === 'To Receive') {
      setFilter = 'toreceive'
    }
    else if (selectedFilter === 'Completed') {
      setFilter = 'completed'
    }
    else if (selectedFilter === 'Canceled') {
      setFilter = 'canceled'
    }

    await axios.get(`/api/transaction/list/${setFilter}`, config)
    .then(response => {
      transactionDispatch({ type: "FETCH_SUCCESS", payload: response.data })
    }).catch(() => {
      transactionDispatch({ type: "FETCH_ERROR" })
    })
  }

  useEffect(() => {
    getTransactionList()
  }, [selectedFilter])

  return (
    <div>
      <div className="position-sticky bg-white status-filter py-2">
        <div className="transaction-filter d-flex justify-content-center gap-3 width-900 mx-auto">
          <button className={`btn-gold py-3 width-200 ${selectedFilter === 'All' ? 'active' : ''}`} onClick={() => setSelectedFilter('All')}>All</button>
          <button className={`btn-gold py-3 width-200 ${selectedFilter === 'Pending' ? 'active' : ''}`} onClick={() => setSelectedFilter('Pending')}>Pending</button>
          <button className={`btn-gold py-3 width-200 ${selectedFilter === 'To Receive' ? 'active' : ''}`} onClick={() => setSelectedFilter('To Receive')}>To Receive</button>
          <button className={`btn-gold py-3 width-200 ${selectedFilter === 'Completed' ? 'active' : ''}`} onClick={() => setSelectedFilter('Completed')}>Completed</button>
          <button className={`btn-gold py-3 width-200 ${selectedFilter === 'Canceled' ? 'active' : ''}`} onClick={() => setSelectedFilter('Canceled')}>Canceled</button>
        </div>
      </div>
      <div className="container mt-4">
        {transactionState.loading ? 
          <div className="loading-content mx-auto width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <DotSpinner 
              size={100}
              speed={0.9} 
              color="#D39E6C" 
            />
            <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
          </div> 
          :
          <div className='table-responsive'>
            
      {transactionState.transactionList &&
              transactionState.transactionList.map((item) => {
                return (
                  <Link to={`/transactions/${item._id}`} key={item._id} className="card mb-4 text-dim shadow text-decoration-none">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                     
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Reference Number</p>
                            
                            <p className='mb-0'>{item.referenceNumber}</p>
                            
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Ordered Date</p>
                            <p className="mb-0 text-truncate cart-detail">
                            {item.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted ">Payment Method</p>
                            <p className="mb-0 cart-detail">
                            {item.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Price</p>
                            <p className="mb-0 cart-detail">
                             
                            {item.transactionTotalPriceAED}
                            </p>
                          </div>
                        </div>
                        <div className="col-md cart-content">
                          <div>
                            <p className="text-muted">Status</p>
                            <p className="mb-0 cart-detail">
                            {item.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })} 
          </div>}
      </div>
    </div>
  );
};

export default Transaction;
