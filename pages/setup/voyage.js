import Voyage from "/Components/Layouts/Setup/Voyage";
import axios from "axios";
import Cookies from "cookies";

const voyage = ({sessionData, vesselsData}) => {
  return (
    <Voyage sessionData={sessionData} vesselsData={vesselsData} />
  )
}

export default voyage
//NEXT_PUBLIC_CLIMAX_GET_ALL_VESSELS
export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res);
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
      headers:{"x-access-token": `${cookies.get('token')}`}
    }).then((x)=>x.data);
    const VesselRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VESSELS).then((x)=>x.data.result);
  
    return{
        props: { sessionData:sessionRequest, vesselsData:VesselRequest }
    }
  }