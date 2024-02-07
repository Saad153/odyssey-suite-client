import { Input } from "antd";
import { useController } from "react-hook-form";
import React from 'react'

const InputComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  return (
    <>
      <div>{props.label}</div>
      <Input 
        disabled={props.disabled} style={{minWidth:props.width, fontSize:12, height:32}} {...props.field} 
        name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur}
      />
    </>
  )
}

export default React.memo(InputComp)