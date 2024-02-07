import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Notes = ({Router, dispatch, incrementTab, moment}) => {

const [notes, setNotes] = useState([])

    useEffect(() => {
      const req = async() => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SEAJOB_NOTES).then((x) => {
        if(x.data.status === 'success') {
          setNotes(x.data.result)
        }})
      }
      req()
    }, [])
    
    return (
    <div className="notificationSide">
      <h5>Notes</h5>
      {notes.map((x, i) => {
        return (
          <div key={i} 
          onClick={() => {
            dispatch(incrementTab({"label": "SE JOB","key": "4-3","id":x.recordId}))
            x.type == "SE" ? Router.push(`/seaJobs/export/${x.recordId}`) 
            : x.type == "SI" ? Router.push(`/seaJobs/import/${x.recordId}`) 
            : x.type == "AI" ? Router.push(`/airJobs/import/${x.recordId}`) :
            Router.push(`/airJobs/export/${x.recordId}`) 
          }}
              className="notifications"
              style={x.opened==0?{backgroundColor:'rgb(181, 227, 169)'}:{backgroundColor:'rgba(255, 255, 255, 0.1)'}}
          >
            <div className="fw-6 fs-15"> {x.title} </div>   
            <div className="fw-6 fs-13" > {x.note} </div>
            <div className="fs-13">Created  by {x.createdBy} </div>
            <div className="fs-13">{(moment(x.createdAt).fromNow())}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Notes