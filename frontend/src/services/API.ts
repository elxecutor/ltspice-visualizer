import axios from 'axios';

export async function parseNetlist(netlist: string) {
  const res = await axios.post('http://localhost:8000/api/netlist/parse/', { netlist });
  return res.data;
}
