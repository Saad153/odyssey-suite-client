// import { Select } from "antd";
// import { Controller } from "react-hook-form";

// const SelectComp = (props) => {
//   return (
//     <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//         <>
//           <div>{props.label}</div>
//           <Select disabled={props.disabled} style={{minWidth:props.width, fontSize:props.font}} 
//             {...field}
//           >
//             {
//               props.options.map((x, index) => {
//                 return(
//                   <Select.Option key={index} value={x.id}>{x.name}</Select.Option>
//                 )
//               })
//             }
//           </Select>
//         </>
//       )}
//     />
//     </>
//   )
// }

// export default SelectComp




import { Select } from "antd";
import { useController } from "react-hook-form";
import React from 'react'

const SelectComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

return(
    <>
    <div>{props.label}</div>
      <Select disabled={props.disabled} style={{minWidth:props.width, fontSize:12}} allowClear
        name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} showSearch
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