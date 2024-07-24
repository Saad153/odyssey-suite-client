import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import Router from 'next/router';
import { useDispatch } from "react-redux";
import { incrementTab } from '/redux/tabs/tabSlice';
import Notifications from "./Notifications";
import Notes from "./Notes";
import Tasks from "./Tasks";
import { Tabs } from 'antd';

  const Home = ({ sessionData }) => {

  const access = Cookies.get('access');
  const dispatch = useDispatch();

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
  }, [sessionData]);

  const onChange = (key) => { };

  const items = [
    {
      key: '1',
      label: 'Notifications / Notes',
      children: <div>
        <Notifications dispatch={dispatch} incrementTab={incrementTab} Router={Router} moment={moment} />
        <Notes dispatch={dispatch} incrementTab={incrementTab} Router={Router} moment={moment} />
    </div>,
    },
    {
      key: '2',
      label: 'Tasks',
      children: <Tasks/>,
    },
  ];

  return (
  <div className="base-page-layout" >
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  </div>
  )};

export default React.memo(Home);