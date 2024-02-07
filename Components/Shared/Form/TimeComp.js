// import { TimePicker } from 'antd';
// import { Controller } from "react-hook-form";

// const TimeComp = (props) => {
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
//           <TimePicker disabled={props.disabled} use12Hours size={props.size} style={{minWidth:props.width}} format={'h:mm A'} {...field} />
//         </>
//       )}
//     />
//   </>
//   )
// }
// export default TimeComp

import { TimePicker } from 'antd';
import { useController } from "react-hook-form";
import React from 'react'

const TimeComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  return (
  <>
    <div>{props.label}</div>
    <TimePicker disabled={props.disabled} 
      use12Hours size={props.size} style={{minWidth:props.width, fontSize:12}} format={'h:mm A'} //{...field} 
      {...props.rest} name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} 
    />
  </>
  )
}
export default React.memo(TimeComp)