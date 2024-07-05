import { DatePicker } from "antd";
import { useController } from "react-hook-form";
import React, { memo } from 'react'

const NumComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{props.label}</div>
      <DatePicker name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} style={{minWidth:props.width, fontSize:12}} />
    </>
  )
}

export default memo(NumComp)