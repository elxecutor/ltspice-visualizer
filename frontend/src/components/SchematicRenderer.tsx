import ELK from 'elkjs/lib/elk.bundled.js';
import { useEffect, useRef } from 'react';

const elk = new ELK();

export default function SchematicRenderer({ components }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!components.length) return;

    const elkInput = {
      id: "root",
      layoutOptions: { "elk.algorithm": "org.eclipse.elk.layered" },
      children: components.map((c, i) => ({ id: c.name, width: 80, height: 40 })),
      edges: components.map((c, i) => ({
        id: `e${i}`,
        sources: [c.from],
        targets: [c.to]
      }))
    };

    elk.layout(elkInput).then(graph => {
      const svg = svgRef.current;
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      graph.children.forEach(node => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", node.x);
        rect.setAttribute("y", node.y);
        rect.setAttribute("width", node.width);
        rect.setAttribute("height", node.height);
        rect.setAttribute("fill", "#ccc");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x + 5);
        text.setAttribute("y", node.y + 20);
        text.textContent = node.id;

        g.appendChild(rect);
        g.appendChild(text);
        svg.appendChild(g);
      });
    });
  }, [components]);

  return <svg ref={svgRef} width="100%" height="500" />;
}