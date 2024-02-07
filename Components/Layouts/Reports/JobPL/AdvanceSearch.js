import { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const fetch = async(value, callback, type) => {
  value.length>2?await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH,{
      search:value,
      type:type
  }).then((x) => {
      callback(x.data.result);
  }):null;
};

const Search = (props) => {

  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const handleSearch = (newValue) => {
    fetch(newValue, setData, props.type);
  };

  useEffect(() => {
    props.getChild(value);
  }, [value])

  return (
    <Select
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={setValue}
      notFoundContent={null}
      allowClear
      options={(data || []).map((d) => ({
        value: d.id,
        label: d.name,
      }))}
    />
  )
};

export default Search;