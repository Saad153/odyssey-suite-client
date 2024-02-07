import React, { useEffect } from 'react';
import { Modal } from 'antd';

const MediumModal = ({visible, setVisible, setEdit, centered, width, children}) => {

  useEffect(() => {
    console.log(centered)
  }, [centered])

  return (
    <div>
    <Modal 
        open={visible}
        onOk={() => {setVisible(false); setEdit(false)}}
        onCancel={() => {setVisible(false); setEdit(false)}}
        width={width}
        footer={false}
        centered={centered}
        //bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        //style={{color:theme=='light'?'black':'white'}}
    >
    {children}
    </Modal>
    </div>
  )
}

export default MediumModal;