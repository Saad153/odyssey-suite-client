import { InputNumber } from "antd";
import { useController } from "react-hook-form";
import React from 'react';

const NumComp = (props) => {
  const { control, name } = props;
  const { field:{onChange, onBlur, value, name: fieldName, ref} } = useController({ control, name });
  return (
    <>
      <div>{props.label}</div>
      <InputNumber {...props.rest} name={fieldName} onChange={onChange} value={value} 
        ref={ref} onBlur={onBlur} disabled={props.disabled} 
        style={{minWidth:props.width, fontSize:12, height:32}} min="0"
      />
    </>
  )
}

export default React.memo(NumComp)