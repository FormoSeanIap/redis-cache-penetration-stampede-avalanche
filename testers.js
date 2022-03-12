const axios = require('axios');

async function axiosReqAll () {  
  const result = await axios.all([req1(),req2()]);
  const data = result.map(res => res.data)
  console.log(data);
}

function req1() {
  return axios.get('http://localhost:3000/stampede');
}

function req2() {
  return axios.get('http://localhost:3000/stampede');
}

axiosReqAll();