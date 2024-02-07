import axios from "axios";

export function getVoucherById({id}) {
    return axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCHER_BY_ID, { 
        headers:{ "id": `${id}` }
    }).then((x)=>x.data.result);
}
