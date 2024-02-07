import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { updateNotification } from '/functions/notifications';
import { Spinner } from 'react-bootstrap';

const Notifications = ({dispatch, incrementTab, Router,  moment}) => {

  const [notifications, setNotifications] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(async() => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFICATION)
      .then((x) => {
        setLoad(false)
        setNotifications(x.data.result)
      })
    }, 3000)
  }, []);

  const update = async(x) =>{
    const data = {opened: 1, subType:x.subType}
    updateNotification(data)    
  }

  return (
  <div className="notificationSide">
    <h5>Notifications</h5>
    {load && <div style={{display:'flex', flex:1, justifyContent:'center', alignContent:'center', alignItems:'center', height:'70%'}}><Spinner/></div>}
    {!load && 
    <>
      {notifications?.map((x, i) => {
        return (
          <div key={i} className="notifications"
          style={x.opened==0?{backgroundColor:'rgb(181, 227, 169)'}:{backgroundColor:'rgba(255, 255, 255, 0.1)'}}
            onClick={()=>{
              update(x);
              dispatch(incrementTab({"label": "SE JOB","key": "4-3","id":x.recordId}));
              Router.push(`/seJob/${x.recordId}`)}
            }
          >
            <div className="fs-15 fw-6"> {x.notification} by {x.createdBy?.name} </div>
            <div className="fs-13">{(moment(x.createdAt).fromNow())}; {moment(x.createdAt).format("YYYY-MMM-DD")}</div>
          </div>
        )})
      }
    </>
    }
  </div>
)}

export default Notifications