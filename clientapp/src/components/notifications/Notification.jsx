import { useEffect, useContext, useState, useReducer } from 'react'
import { ItemPropsContext } from "../../context/itemPropsContext";
import axios from 'axios'
import moment from 'moment';

import { DotSpinner } from '@uiball/loaders'

import { NOTIFICATION_STATE, notificationsReducer } from "../../reducers/notificationsReducer";

import { AiOutlineMail, AiOutlineCheckCircle } from 'react-icons/ai'

import './notification.css'

const Notification = () => {
    const { token } = useContext(ItemPropsContext);
    
    const [notificationState, notificationDispatch] = useReducer(notificationsReducer, NOTIFICATION_STATE)

    const [loading, setLoading] = useState(false);
    let loadingTest = false
    let page = 1

    const getNotificationList = async () => {
        notificationDispatch({ type: "FETCH_START" })

        const config = {
            headers: {
                'x-access-token': token
            }
        };

        const data = {
            page
        }

        await axios.post('/api/notification/getList', data, config)
        .then(response => {
            notificationDispatch({ type: "FETCH_SUCCESS", payload: response.data })
            page++
            if (response.data.length === 10)
                loadingTest = false
        })
        .catch(err => console.log(err))
    };

    const readAll = async () => {
        const config = {
            headers: {
                'x-access-token': token
            }
        };

        await axios.post('/api/notification/readAll', {}, config)
        .then(response => {
            notificationDispatch({ type: "READ_ALL" })
        })
        .catch(() => setLoading(false));
    };

    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY;

        if (documentHeight - windowHeight - scrollPosition < 10 && !loadingTest) {
        // You can adjust the 200 value as per your preference to start fetching data a bit earlier or later before reaching the bottom.
            loadingTest = true
            getNotificationList(); // Fetch data when reaching the bottom of the page
        }
    };

    const formatDate = (date) => {
        const dateTimeAgo = moment(new Date(date)).fromNow();
        return dateTimeAgo
    }

    const readNotification = async (id) => {
        const config = {
            headers: {
                'x-access-token': token
            }
        };

        await axios.post('/api/notification/readNotification', { notificationId: id }, config)
        .then(response => {
            notificationDispatch({ type: "READ_NOTIFICATION", payload: id })
        })
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        getNotificationList()
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="container notification-container my-3 shadow">
            <div className='row bg-white py-2 notification-head-row'>
                <div className='d-flex justify-content-end'>
                    <button className='btn-gold end-0' onClick={() => readAll()}>mark all as read</button>
                </div>
            </div>
            {notificationState.notificationList &&
                notificationState.notificationList.map(item => {
                    return (
                        <div className='row notification-box bg-white py-2 border-bottom text-dim' key={item._id}>
                            <div className='col d-flex align-items-center'>
                                {!item.isRead && <span className="dot"></span>}
                            </div>
                            <div className='col-9 d-flex flex-column justify-content-center'>
                                <p className={`mb-0 ${item.isRead ? '' : 'mont-bold'}`}>{item.description}</p>
                                <p className={`mb-0 mont-regular`}>{formatDate(item.createdAt)}</p>
                            </div>
                            <div className='col d-flex justify-content-center align-items-center text-gold'>
                                {!item.isRead && <AiOutlineCheckCircle className='notification-action' onClick={() => readNotification(item._id)}/>}
                            </div>
                        </div>
                    )
                })}

            {notificationState.loading && 
                <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <DotSpinner 
                        size={100}
                        speed={0.9} 
                        color="#D39E6C" 
                    />
                    <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
                </div> }
        </div>
    )
}

export default Notification