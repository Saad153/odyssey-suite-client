import React from 'react'
import { Input, Form } from "antd";
import { useController } from "react-hook-form";
const { TextArea } = Input;

const TextComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{props.label}</div>
      <TextArea {...props.rest} name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} style={{minWidth:props.width, fontSize:12}} />
    </>
  )
}

export default React.memo(TextComp)