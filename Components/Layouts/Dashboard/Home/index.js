import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import Router from 'next/router';
import { useDispatch } from "react-redux";
import { incrementTab } from '/redux/tabs/tabSlice';
import Notifications from "./Notifications";
import Notes from "./Notes";

  const Home = ({ sessionData }) => {

    const access = Cookies.get('access');
    const dispatch = useDispatch();

    useEffect(() => {
      if(sessionData.isLoggedIn==false){
        Router.push('/login')
      }
    }, [sessionData]);

  return (
  <div className="base-page-layout d-flex" >
    {access?.includes("accounts") ? 
    <Notifications dispatch={dispatch} incrementTab={incrementTab} Router={Router} moment={moment} />
    :<Notes dispatch={dispatch} incrementTab={incrementTab} Router={Router} moment={moment} />
    }
  </div>
  )};

export default Home;
