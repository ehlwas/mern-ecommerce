import { useContext, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { ItemPropsContext } from "../../context/itemPropsContext";
import { TRANSACTION_DETAILS_STATE, transactionDetailsReducer } from "../../reducers/transactionDetailsReducer";
import axios from "axios";

import { DotSpinner } from '@uiball/loaders'

import "./transactiondetails.css";

const TransactionDetails = () => {
  const { token } = useContext(ItemPropsContext);

  const { transactionId } = useParams();

  const [transactionState, transactionDispatch] = useReducer(
    transactionDetailsReducer,
    TRANSACTION_DETAILS_STATE
  );

  const getTransactionDetails = async () => {
    transactionDispatch({ type: "FETCH_START" });

    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    await axios
      .get(`/api/transaction/${transactionId}`, config)
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

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return (
    <div className="pb-5 pt-3 text-dim">
      {transactionState.loading ?
        (
          <div className="loading-content mx-auto width-500 height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <DotSpinner 
              size={100}
              speed={0.9} 
              color="#D39E6C" 
            />
            <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
          </div> 
        )
        :
        (
          <div className="container">
            <div className="mt-2 mb-3">
              <Link to="/transactions" className="btn-gold px-3 py-2 text-decoration-none">
                Back
              </Link>
            </div>

            <div className="bg-white p-3 mb-3 shadow">
              <h2 className="text-gold">Order Details</h2>
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

            <div className="bg-white p-3 mb-3 shadow">
              <h2 className="text-gold">Delivery Address</h2>
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
              <p className="mb-0">
                Address:{" "}
                <span className="mont-bold">
                  {transactionState.transactionDetails.deliveryAddress}
                </span>
              </p>
            </div>

            <div className="bg-white p-3 mb-3 shadow">
              <h2 className="text-gold">Products</h2>
              <div className='table-responsive'>
                <table className="table cart-table text-center align-middle">
                  <thead className="mont-bold">
                    <tr>
                      <th className="image-column text-muted"></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Name</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Color</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Size</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Quantity</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Product Price</p></th>
                      <th className="items-column text-muted"><p className="mb-0 mont-bold">Total</p></th>
                    </tr>
                  </thead>
                  <tbody className="mont-regular">
                    {transactionState.transactionDetails.transactionItems &&
                      transactionState.transactionDetails.transactionItems.map(item => {
                        return (
                          <tr key={item._id}>
                            <td>
                              <img
                                src={item.product[0].imageUrl}
                                className="img-fluid"
                                alt="Generic placeholder image"
                              />
                            </td>
                            <td>
                              <p className='mb-0'>{item.product[0].model}</p>
                            </td>
                            <td>
                              <p className='mb-0'>{item.product[0].color}</p>
                            </td>
                            <td>
                              <p className='mb-0'>{item.size[0].size}</p>
                            </td>
                            <td>
                              <p className='mb-0'>{item.quantity}</p>
                            </td>
                            <td>
                              <p className="mb-0">{item.size[0].priceAED} AED</p>
                            </td>
                            <td>
                              <p className="mb-0">{item.totalPriceAED} AED</p>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-3 shadow">
              <h2 className="text-gold">Order Summary</h2>
              <table className="table-order-summary width-80vw mx-auto px-3">
                <tr className="border-bottom">
                  <td className="mont-regular">Subtotal:</td>
                  <td className="mont-bold">{transactionState.transactionDetails.transactionTotalPriceAED} AED</td>
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
                  <td className="mont-regular">Wallet Used:</td>
                  <td className="mont-bold">{transactionState.transactionDetails.transactionWalletUsed ? transactionState.transactionDetails.transactionWalletUsed : 0}</td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Loyalty Points Used:</td>
                  <td className="mont-bold">{transactionState.transactionDetails.transactionPointsUsed ? transactionState.transactionDetails.transactionPointsUsed : 0}</td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Total:</td>
                  <td className="mont-bold">{transactionState.transactionDetails.transactionTotalPriceAED} AED</td>
                </tr>
                <tr className="border-bottom">
                  <td className="mont-regular">Loyalty Points Gained:</td>
                  <td className="mont-bold">{transactionState.transactionDetails.transactionTotalPoints ? transactionState.transactionDetails.transactionTotalPoints : 0}</td>
                </tr>
              </table>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TransactionDetails;
