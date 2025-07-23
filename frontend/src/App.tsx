import { useState } from 'react';
import { parseNetlist } from './services/API';
import SchematicRenderer from './components/SchematicRenderer';

function App() {
  const [netlist, setNetlist] = useState('');
  type NetlistData = { components: any[] }; // Replace 'any' with the actual component type if known
  const [data, setData] = useState<NetlistData | null>(null);

  const handleSubmit = async () => {
    const result = await parseNetlist(netlist);
    setData(result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>LTspice Netlist to Schematic</h2>
      <textarea
        rows={10}
        cols={80}
        value={netlist}
        onChange={(e) => setNetlist(e.target.value)}
        placeholder="Paste LTspice netlist here..."
      />
      <br />
      <button onClick={handleSubmit}>Generate Schematic</button>
      {data && <SchematicRenderer components={data.components} />}
    </div>
  );
}
export default App;
