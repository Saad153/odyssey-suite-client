// import { Form, DatePicker } from 'antd';
// import { Controller  } from "react-hook-form";

// const DateComp = (props) => {
//   return (
//   <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//         <>
//           <div>{props.label}</div>
//           <DatePicker disabled={props.disabled} size={props.size} style={{minWidth:props.width}} {...field} />
//         </>
//       )}
//     />
//   </>
//   )
// }
// export default DateComp

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