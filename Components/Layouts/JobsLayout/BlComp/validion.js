import * as yup from "yup";

export const validationSchema = yup.object().shape({
  stamps: yup
    .array()
    .of(
      yup.object().shape({
        // Define validation rules for each object in the array
        // Example:
        group_stamp: yup.string().required("Group is required"),
        stamp: yup.string().required("Stamp is required"),
      })
    )
    .required("Stamps is required"),
  // Add validation for other fields as needed
});
