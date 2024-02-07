// import { Checkbox } from "antd";
// import { Controller } from "react-hook-form";

// const CheckGroupComp = (props) => {
//   return (
//     <>
//       <Controller
//         name={`${props.name}`}
//         defaultValue=""
//         control={props.control}
//         {...props.register(`${props.name}`)}
//         render={({ field }) => (
//             <>
//             <div>{props.label}</div>
//             <Checkbox.Group 
//                 {...field}
//                 disabled={props.disabled}
//                 options={props.options}
//             />
//             </>
//             )
//         }
//       />
//     </>
//   )
// }

// export default CheckGroupComp

import { Checkbox } from "antd";
import { useController } from "react-hook-form";
import { memo } from "react";

//const CheckGroupComp = ({ control, name, label, ...rest }) => {
const CheckGroupComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{props.label}</div>
      <Checkbox.Group  name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} 
        {...props.rest}
        disabled={props.disabled}
        options={props.options}
        style={{width:props.width, fontSize:12}}
      />
    </>
  )
}

export default memo(CheckGroupComp)