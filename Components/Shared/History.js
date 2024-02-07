import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { Row, Col, Spinner} from 'react-bootstrap'

const History = ({history, load}) => {

    useEffect(() => { console.log(history) }, []);
    
  return (
    <div className='client-styles' style={{maxHeight:720, overflowY:'hidden', overflowX:'hidden'}}>
      <h6>Update History</h6>
      <hr className='mb-3'/>
        <div className=''>
        {load && <div style={{textAlign:'center', overflowY:'hidden'}}><Spinner className='my-5' animation="border" /></div>}
        {!load &&
        <div className='px-2' style={{maxHeight:500, overflowY:'auto', overflowX:'hidden'}}>
            {history.length>0 &&
            <>
                {history.map((x,i)=>{
                    return(
                    <Row key={i}>
                        <Col md={8}><div>{parse(x.html)}</div></Col>
                        <Col md={4}>
                            <div style={{float:'right'}}>
                                <div>By: <strong>{x.Employee.name}</strong></div>
                                <div className='title-rec'>{x.updateDate}</div>
                            </div>
                        </Col>
                        <hr className='my-1' />
                    </Row>
                    )
                })}
            </>
            }
            { history.length==0 && <div className='text-center my-5'> No Change History </div> }
        </div>
        }
        </div>
    </div>
  )
}

export default History