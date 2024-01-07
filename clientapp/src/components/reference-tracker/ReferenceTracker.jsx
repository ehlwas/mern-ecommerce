import { useReducer, useState } from "react";
import { TRANSACTION_DETAILS_STATE, transactionDetailsReducer } from "../../reducers/transactionDetailsReducer";
import axios from 'axios'

import { DotSpinner } from '@uiball/loaders'

const ReferenceTracker = () => {
  const [firstSearch, setFirstSearch] = useState(false)
  const [referenceNum, setReferenceNum] = useState('')
  
  const [transactionState, transactionDispatch] = useReducer(
    transactionDetailsReducer,
    TRANSACTION_DETAILS_STATE
  );

  const getTransactionDetails = async () => {
    transactionDispatch({ type: "FETCH_START" });
    setFirstSearch(true)

    await axios
      .get(`/api/track/${referenceNum}`)
      .then((response) => {
        console.log(response.data[0]);
        transactionDispatch({
          type: "FETCH_SUCCESS",
          payload: response.data[0],
        });
      })
      .catch(() => {
        transactionDispatch({ type: "FETCH_ERROR" });
      });
  };

  const submitSearch = async (e) => {
    if (e.key !== 'Enter')
    return

    await getTransactionDetails()
  }

  return (
    <div className="py-5 text-gold" style={{ backgroundColor: "#dedede" }}>
      <div className="container">
        <input type="text" className="w-100 mb-3 form-control search-input input-gold" 
        placeholder="Type your reference number then press Enter." value={referenceNum} onChange={e => setReferenceNum(e.target.value)} onKeyDown={submitSearch} />
      </div>
      {firstSearch ? (
        transactionState.loading ? (
          <div
            className="loading-content mx-auto width-500 height-50vh"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DotSpinner 
              size={100}
              speed={0.9} 
              color="#D39E6C" 
            />
            <p
              className="text-gold"
              style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}
            >
              Loading...
            </p>
          </div>
        ) : (
          transactionState.transactionDetails ?
          (<div className="container">
            <div className="bg-white p-3 mb-3">
              <h2>Order Details</h2>
              <p>
                Status:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.status}
                </span>
              </p>
              <p>
                Payment Method:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.paymentMethod}
                </span>
              </p>
              {/* <p>
                Credit Card ID:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.stripeId}
                </span>
              </p> */}
              <p className="mb-0">
                Reference Number:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.referenceNumber}
                </span>
              </p>
            </div>

            <div className="bg-white p-3 mb-3">
              <h2>Delivery Address</h2>
              <p>
                Receiver Name:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.receiverName}
                </span>
              </p>
              <p>
                Receiver Number:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.receiverNumber}
                </span>
              </p>
              <p>
                Receiver Email:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.guestEmail}
                </span>
              </p>
              <p className="mb-0">
                Address:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.deliveryAddress}
                </span>
              </p>
            </div>

            <div className="bg-white p-3 mb-3">
              <h2>Products</h2>
              {transactionState.transactionDetails.transactionItems &&
                transactionState.transactionDetails.transactionItems.map(
                  (item) => {
                    return (
                      <div
                        key={item._id}
                        className="card rounded-0 bg-white text-gold"
                      >
                        <div className="card-body px-4 p-2">
                          <div className="row align-items-center">
                            <div className="col-md">
                              <img
                                src={item.product[0].imageUrl}
                                className="img-fluid"
                                alt="Generic placeholder image"
                              />
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">Name</p>
                                <p className="lead fw-normal mb-0">
                                  {item.product[0].model}
                                </p>
                              </div>
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">
                                  Color
                                </p>
                                <p className="lead fw-normal mb-0">
                                  <i
                                    className="fas fa-circle me-2"
                                    style={{ color: "#fdd8d2" }}
                                  ></i>
                                  {item.product[0].color}
                                </p>
                              </div>
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">Size</p>
                                <p className="lead fw-normal mb-0">
                                  <i
                                    className="fas fa-circle me-2"
                                    style={{ color: "#fdd8d2" }}
                                  ></i>
                                  {item.size[0].size}
                                </p>
                              </div>
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">
                                  Quantity
                                </p>
                                <p className="lead fw-normal mb-0">
                                  {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">
                                  Product Price
                                </p>
                                <p className="lead fw-normal mb-0">
                                  {item.size[0].priceAED} AED
                                </p>
                              </div>
                            </div>
                            <div className="col-md d-flex justify-content-center">
                              <div>
                                <p className="small text-muted mb-4 pb-2">
                                  Total
                                </p>
                                <p className="lead fw-normal mb-0">
                                  {item.totalPriceAED} AED
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>

            <div className="bg-white p-3">
              <h2>Order Summary</h2>
              <table className="table-order-summary width-80vw mx-auto px-3">
                <tr className="border-bottom">
                  <td className="mont-regular">Subtotal:</td>
                  <td className="mont-bold">
                    {transactionState.transactionDetails.transactionTotalPriceAED}{" "}
                    AED
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Delivery Fee:</td>
                  <td className="mont-bold">0</td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Service Fee:</td>
                  <td className="mont-bold">0</td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Total:</td>
                  <td className="mont-bold">
                    {transactionState.transactionDetails.transactionTotalPriceAED}{" "}
                    AED
                  </td>
                </tr>
              </table>
            </div>
          </div>)
          :
          (<div className="container">
            <h2>No result.</h2>
          </div>)
        ))
        :
        <div className="height-50vh"></div>}
    </div>
  );
};

export default ReferenceTracker;
