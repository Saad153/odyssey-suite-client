import { Select } from "antd";
import { useController } from "react-hook-form";
import React from 'react';

const SelectSearchComp = (props) => {
  const { control, name, label, options, disabled, width, clear, rest } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  
  const SelectSearch =({props, rest}) => {
    let tempVal = [];
     options.forEach((x) => {
      tempVal.push({
        value:x.id,
        label:x.name,
        code:x.code,
        // country:x.country
      })
    });  


    return(
      <Select disabled={disabled} style={{minWidth:width||200, maxWidth:props.width||200, fontSize:12}}
        name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} 
        showSearch 
        optionFilterProp="children"
        filterOption={(input, option) =>
          ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
          ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase()) //||
          // ((option?.country) ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={tempVal}
        allowClear={clear}
        {...rest}
      />
    )
  }

  return(
  <>
    <div className="">{label}</div>
    <SelectSearch props={props} rest={rest} />
  </>
)}

export default React.memo(SelectSearchComp)