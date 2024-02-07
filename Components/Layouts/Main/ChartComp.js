"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import moment from "moment";
import axios from 'axios';

const ChartComp = ({chartData, type}) => {

  const [chartOptions, setChartOptions] = useState({
    series: [
      { name: "Income", data: [] },
      { name: "Expense", data: [] },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 },
        toolbar: {
          show: false
        }
      },
      colors: ['#40a347', '#EE7C6F'],
      dataLabels: { enabled: true },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Income & Expense',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Amount'
        },
      },
    },
  });
  const [chartOptionsTwo, setChartOptionsTwo] = useState({
    series: [
      { name: "Cash Flow", data: [] },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 },
        toolbar: {
          show: false
        }
      },
      colors: ['#3492BA'],
      dataLabels: { enabled: true },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Cash Flow',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Amount'
        },
      },
    },
  });

  useEffect(() => {
    getcashflow()
  }, [])

  async function getcashflow(){
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_CASH_FLOW_TWO, {}).then((res)=>{
      let dates = [];
      let valuesOne = [];
      let valuesTwo = [];
      let valuesThree = [];
      //cashexpenditure
      res.data.result.forEach((x) => {
        let date = moment(x.createdAt).format("MMM-DD");
        if(dates.includes(date)) {
          x.type == 'Job Payment'?
          valuesTwo[valuesTwo.length-1] = parseFloat(valuesTwo[valuesTwo.length-1]) + parseFloat(x['Invoice_Transactions.amount']):
          valuesOne[valuesOne.length-1] = parseFloat(valuesOne[valuesOne.length-1]) + parseFloat(x['Invoice_Transactions.amount']);
        } else if(x.type == 'Job Reciept') {
          dates.push(date)
          valuesOne.push(parseFloat(x['Invoice_Transactions.amount']))
          valuesTwo.push(0)
        } else if(x.type == 'Job Payment') {
          dates.push(date)
          valuesOne.push(0)
          valuesTwo.push(parseFloat(x['Invoice_Transactions.amount']))
        }
      })
      valuesTwo.forEach((x, i)=>{
        valuesThree.push(parseFloat(valuesOne[i]) - parseFloat(valuesTwo[i]))
      })
      setChartOptions({
        series: [
          { name: "Income", data: valuesOne },
          { name: "Sales", data: valuesTwo },
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 },
            toolbar: {
              show: false
            }
          },
          colors: ['#40a347', '#EE7C6F'],
          dataLabels: { enabled: true },
          stroke: { curve: 'smooth' },
          title: {
            text: 'Income & Expense',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: dates,
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Amount'
            },
          },
        },
      });
      setChartOptionsTwo({
        series: [
          { name: "Cash Flow", data: valuesThree },
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 },
            toolbar: {
              show: false
            }
          },
          colors: ['#3492BA'],
          dataLabels: { enabled: true },
          stroke: { curve: 'smooth' },
          title: {
            text: 'Cash Flow',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: dates,
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Amount'
            },
          },
        },
      })
    })
  }

  return(
    <div>
      { type=="One" && <Chart options={chartOptions.options} series={chartOptions.series} type="line" width="100%" height={"200%"} />}
      { type=="Two" && <Chart options={chartOptionsTwo.options} series={chartOptionsTwo.series} type="line" width="100%" height={"200%"} />}
    </div>
  )
}

export default ChartComp;