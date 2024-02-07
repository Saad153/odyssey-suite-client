// import { Radio } from 'antd';
// import { Controller } from "react-hook-form";

// const RadioComp = (props) => {

//   return (
//     <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//           <>
//             <div>{props.label}</div>
//             <Radio.Group disabled={props.disabled} options={props.options} {...field} />
//           </>
//       )}
//     />
//     </>
//   )
// }

// export default RadioComp

import { Radio } from "antd";
import { useController } from "react-hook-form";
import React from 'react'

const RadioComp = (props) => {

  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{props.label}</div>
      <Radio.Group  name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} style={{fontSize:12}}
        {...props.rest}
        options={props.options}
      />
    </>
  )
}

export default React.memo(RadioComp)