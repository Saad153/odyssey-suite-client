import * as yup from "yup"; 

export const defaultValues = {
  ComapnyId:1,
  currency:"PKR",
  exRate:"1.00",
  chequeDate:"",
  chequeNo:"",
  costCenter:"KHI",
  payTo:"",
  type:"",
  vType:"",
  Voucher_Heads: []
}

export const validationSchema = yup.object().shape({
  vType: yup.string().required('Type is required'),
  //payTo: yup.string().required('Pay To is required'),
  //costCenter: yup.string().required('Cost Center is required'),
  //ChildAccountId: yup.string().required('Account is required'),
  Voucher_Heads: yup.array().of(
    yup.object().shape({
      // Define validation rules for each object in the array
      // Example:
      ChildAccountId: yup.string().required('Account is required'),
      amount: yup.number().required('Amount is required'),
      //narration: yup.string().required('Narration is required'),
    })
  ).required('Voucher Heads is required'),
  // Add validation for other fields as needed
});