import React, { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Table from "./Table";
import JobList from "./JobList";
import { Modal } from "antd";
import openNotification from "../../../Shared/Notification";
const validationSchema = yup.object().shape({
  to: yup.string().required("Please Select Date"),
  from: yup.string().required("Please Select Date"),
});

const Index = ({ data }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [sortBy, setSortBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [dg, setDg] = useState("");
  const [approved, setApproved] = useState("");
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState("");
  const [res, setRes] = useState({});
  const [seaExports, setseaExports] = useState("");

  const onChange = (e) => {
    console.log(`checked = ${e}`);
    setseaExports(e);
  };

  const onsubmit = (data) => {
    const req = async () => {
      const temp = await axios
        .get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_GET_JOB_BY_VALUE, {
          headers: { ...data },
        })
        .then((x) => {
          if (x.status == 200) {
            if (x.data.result.length > 0) {
              setResult(x.data.result);
              let res;
              if (groupBy) {
                let unique = [
                  ...new Set(x.data.result.map((item) => item[groupBy])),
                ];
                res = unique.map((id) =>
                  x.data.result.filter((item) => item[groupBy] === id)
                );
                if(sortBy) {
                if (sortBy == "hbl" || sortBy == "mbl") {
                  const sortByProperty = () => {
                    return res.map((x) =>
                      x.sort((a, b) => {
                        const valueA = a.Bl[sortBy].toString().toLowerCase();
                        const valueB = b.Bl[sortBy].toString().toLowerCase();
                        if (valueA < valueB) {
                          return -1; // a comes before b
                        } else if (valueA > valueB) {
                          return 1; // b comes before a
                        }
                        return 0; // elements are considered equal
                      })
                    );
                  };

                  res = sortByProperty()
                }
                else if (sortBy == "jobNumber") {
                  const sortByProperty = () => {
                    return res.map((x) =>
                      x.sort((a, b) => {
                        const valueA = a["jobId"].toString().toLowerCase();
                        const valueB = b["jobId"].toString().toLowerCase();
                        if (valueA < valueB) {
                          return -1; // a comes before b
                        } else if (valueA > valueB) {
                          return 1; // b comes before a
                        }
                        return 0; // elements are considered equal
                      })
                    );
                  };
                  res = sortByProperty()
                }
              }
                if(seaExports) {
                  if(seaExports.includes("export") && seaExports.includes("import")) {
                  res
                  //  res= res.map((x) => x.filter((y) => y.operation  ==  "SE"))
                }
                else if(seaExports.includes("import")) {
                  res= res.map((x) => x.filter((y) => y.operation  ==  "SI"))
               }
               else if(seaExports.includes("export")) {
                res= res.map((x) => x.filter((y) => y.operation  ==  "SE"))

             }
              }
              if(approved) {
                if(approved == 'approved') {
                   res= res.map((x) => x.filter((y) => y.approved  ==  "true"))
                }
                else if(approved == 'unUpproved') {
                  res= res.map((x) => x.filter((y) => y.approved  ==  "false"))
               }
               else if(approved == 'all') {
                res
             }
              }
              if(dg) {
                if(dg == 'dg') {
                   res= res.map((x) => x.filter((y) => y.dg  ==  "DG"))
                }
                else if(dg == 'nonGg') {
                  res= res.map((x) => x.filter((y) => y.dg  ==  "non-DG"))
               }
               else if(dg == 'all') {
                res
             }
              }
                setResult(res);


              }

              if(!groupBy) {
                let res = x.data.result
                if(sortBy) {
              if ( sortBy == "hbl" || sortBy == "mbl") {
                const sortByProperty = () => {
                  return res.sort((a, b) => {
                    const valueA = a.Bl[sortBy].toString().toLowerCase();
                    const valueB = b.Bl[sortBy].toString().toLowerCase();
                    if (valueA < valueB) {
                      return -1; // a comes before b
                    } else if (valueA > valueB) {
                      return 1; // b comes before a
                    }
                    return 0; // elements are considered equal
                  });
                };
                res = sortByProperty()
              }
              else if ( sortBy == "jobNumber") {
                const sortByProperty = () => {
                  return res.sort((a, b) => {
                    const valueA = a["jobId"].toString().toLowerCase();
                    const valueB = b["jobId"].toString().toLowerCase();
                    if (valueA < valueB) {
                      return -1; // a comes before b
                    } else if (valueA > valueB) {
                      return 1; // b comes before a
                    }
                    return 0; // elements are considered equal
                  });
                };
                res = sortByProperty()
              }
                }
                if(approved) {
                  if(approved == 'approved') {
                     res= res.filter((y) => y.approved  ==  "true")
                  }
                  else if(approved == 'unUpproved') {
                    res= res.filter((y) => y.approved  ==  "false")
                 }
                 else if(approved == 'all') {
                  res
               }
                }
                if(dg) {
                  if(dg == 'dg') {
                     res= res.filter((y) => y.dg  ==  "DG")
                  }
                  else if(dg == 'nonGg') {
                    res= res.filter((y) => y.dg  ==  "non-DG")
                 }
                 else if(dg == 'all') {
                  res
               }
                }
                if(seaExports) {
                  if(seaExports.includes("export") && seaExports.includes("import")) {
                    res
                  }
                  else if(seaExports.includes("import")) {

                    res= res.filter((y) => y.operation  ==  "SI")
                 }
                 else if(seaExports.includes("export")) {
                  res=  res.filter((y) => y.operation  ==  "SE")
                }
                }
                  setResult(res);
            }

              setVisible(true);
            }
            else {
              openNotification("Error", `No Records Found`, "red");  
            }
          } else {
            console.log("an error occurred")
          }
        });
    };
    req();
  };

  return (
    <div className="base-page-layout">
      <JobList
        onChange={onChange}
        data={data}
        register={register}
        control={control}
        handleSubmit={handleSubmit}
        onsubmit={onsubmit}
        errors={errors}
        sortBy={sortBy}
        groupBy={groupBy}
        dg={dg}
        approved={approved}
        setVisible={setVisible}
        setGroupBy={setGroupBy}
        setSortBy={setSortBy}
        setDg={setDg}
        setseaExports={setseaExports}
        setApproved={setApproved}
      />
      <Modal
        open={visible}
        width={"100%"}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={false}
        maskClosable={false}
        title={`All Jobs`}
      >
        <Table result={result} groupBy={groupBy}/>
      </Modal>
    </div>
  );
};

export default Index;
