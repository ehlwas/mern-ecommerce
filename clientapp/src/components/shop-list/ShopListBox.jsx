import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import axios from "axios";
import { ItemPropsContext } from '../../context/itemPropsContext'

import placeholderImg from '../../assets/placeholder-image.jpg'

const ShopListBox = ({ item, group, showNotification }) => {
    const { token, setCartCount, cartCount } = useContext(ItemPropsContext)

    const [sizeData, setSizeData] = useState(0)
    const [loadingBtn, setLoadingBtn] = useState(false)

    const sizeChanged = (sizeId) => {
        setSizeData(item.sizeData.find(q => q._id === sizeId))
    }

    const addToCart = async () => {
        setLoadingBtn(true)
        const config = {
            headers: {
                'x-access-token': token
            }
        }
        const url = '/api/cart/add'

        const data = {
            'productId': item._id,
            'sizeId': sizeData._id
        }

        await axios.post(url, data, config)
        .then(response => {
            showNotification()
            if (response.data.added === 1) {
                const getCartCount = localStorage.getItem('cartCount')
                const newCount = parseInt(getCartCount) + 1
                localStorage.setItem('cartCount', newCount)
                setCartCount(newCount)
            }
        }).catch(err => console.log(err))
        setLoadingBtn(false)
    }

    const addToCartGuest = async () => {
        let storageCart = localStorage.getItem('guestCart')

        if (!storageCart) {
            let addToCart = [
                {
                    'productId': item._id,
                    'sizeId': sizeData._id,
                    'quantity': 1
                }
            ]
            localStorage.setItem('guestCart', JSON.stringify(addToCart))
        } else {
            let data = JSON.parse(storageCart)
            
            const existingCart = data.find(q => q.sizeId === sizeData._id)

            if (existingCart) {
                console.log('exisitng')
                let newCart = data.map(cartItem => {
                    if (cartItem.sizeId === sizeData._id) {
                        return { ...cartItem, quantity: cartItem.quantity + 1 }
                    } else {
                        return cartItem
                    }
                })
                localStorage.setItem('guestCart', JSON.stringify(newCart))
            }
            else {
                data.push({
                    'productId': item._id,
                    'sizeId': sizeData._id,
                    'quantity': 1
                })
                localStorage.setItem('guestCart', JSON.stringify(data))

                if (!cartCount)
                    setCartCount(1)
                else
                    setCartCount(prev => prev + 1)
            }
        }
        showNotification()
    }

    useEffect(() => {
        setSizeData(item.sizeData[0])
    }, [])

    return (
        <div className={`${group === 'Pre-Sleep' ? 'text-gold' : 'text-lblue'} card rounded-0 border-0 shadow shoplist-item-box`}>
            {/* <Link to={`/shop/${group}/${item.urlId}`}><img src={item.imageUrl} className="card-img-top rounded-0 shadow-sm" alt="Product Image" /></Link> */}
            <Link to={`/shop/${group}/${item.urlId}`}><img src={placeholderImg} className="card-img-top rounded-0 shadow-sm" alt="Product Image" /></Link>
            <div className="card-body">
                <div className="row">
                    <div className="col-9">
                    <Link to={`/shop/${group}/${item.urlId}`} className={`${group === 'Pre-Sleep' ? 'text-gold' : 'text-lblue'} text-decoration-none`}>
                        <h6 className="card-title mont-bold text-truncate">{item.model}</h6>
                    </Link>
                    </div>
                    <div className="col-3">
                        <p className="mb-0 text-size-xsmall text-end text-dim">{sizeData.priceAED} AED</p>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    {token ? 
                        <button className={`btn-black text-size-xsmall`} onClick={() => addToCart()}>add to card</button>
                        :
                        <button className={`btn-black text-size-xsmall`} onClick={() => addToCartGuest()}>add to card</button>}
                    <select className={`input-black mont-regular`} onChange={e => sizeChanged(e.target.value)}>
                        {item.sizeData.map(sizeItem => {
                            return (
                                <option key={sizeItem._id} value={sizeItem._id}>{sizeItem.size}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}

ShopListBox.propTypes = {
    item: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      urlId: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      sizeData: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            size: PropTypes.string.isRequired,
            priceAED: PropTypes.number.isRequired,
          })
      ).isRequired,
    }).isRequired,
    group: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
};

export default ShopListBox;