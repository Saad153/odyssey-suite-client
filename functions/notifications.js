import axios from "axios";

export const createNotification = async (data) => {
  const res = await axios
    .post(process.env.NEXT_PUBLIC_CLIMAX_POST_NOTIFICATION, { data })
    .then((x) => {
      //console.log(x.data.result);
    });
};


export const updateNotification = async (data) => {
  const res = await axios
  .post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_NOTIFICATION, { data })
  .then((x) => {
    //console.log(x.data.result);
  });

}