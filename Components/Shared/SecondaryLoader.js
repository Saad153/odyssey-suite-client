import Image from 'next/image'
import {Spinner} from 'react-bootstrap'

const SecondaryLoader = () => {
    return (
        <div>
            <div className="text-center py-5">
                <Spinner animation="border" style={{height:"30px", width:"30px"}} />
              </div>
        </div>
    )
}

export default SecondaryLoader