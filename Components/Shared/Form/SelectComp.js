import { Select } from "antd";
import { useController } from "react-hook-form";
import React from 'react'

const SelectComp = (props) => {
  const { control, name,defaultValue } = props;

  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name, defaultValue});

return(
    <>
    <div>{props.label}</div>
      <Select disabled={props.disabled} style={{minWidth:props.width, fontSize:12}} allowClear
        name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} showSearch
        defaultValue={defaultValue}
         {...props.rest}
      >
        {
          props.options.map((x, index) => {
            return(
              <Select.Option key={index} value={x.id}>{x.name}</Select.Option>
            )
          })
        }
      </Select>
    </>
)}

export default React.memo(SelectComp)