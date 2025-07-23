import ELK from 'elkjs/lib/elk.bundled.js';
import { useEffect, useRef } from 'react';

const elk = new ELK();

type ComponentType = {
  name: string;
  from: string;
  to: string;
};

type SchematicRendererProps = {
  components: ComponentType[];
};

export default function SchematicRenderer({ components }: SchematicRendererProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!components.length) return;

    const elkInput = {
      id: "root",
      layoutOptions: { "elk.algorithm": "org.eclipse.elk.layered" },
      children: components.map((c) => ({ id: c.name, width: 80, height: 40 })),
      edges: components.map((c, i) => ({
        id: `e${i}`,
        sources: [c.from],
        targets: [c.to]
      }))
    };

    elk.layout(elkInput).then(graph => {
      const svg = svgRef.current;
      if (!svg) return;
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      if (!graph.children) return;
      graph.children.forEach(node => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", node.x !== undefined ? node.x.toString() : "0");
        rect.setAttribute("y", node.y !== undefined ? node.y.toString() : "0");
        rect.setAttribute("width", node.width !== undefined ? node.width.toString() : "0");
        rect.setAttribute("height", node.height !== undefined ? node.height.toString() : "0");
        rect.setAttribute("fill", "#ccc");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const textX = node.x !== undefined ? (node.x + 5).toString() : "5";
        const textY = node.y !== undefined ? (node.y + 20).toString() : "20";
        text.setAttribute("x", textX);
        text.setAttribute("y", textY);
        text.textContent = node.id;

        g.appendChild(rect);
        g.appendChild(text);
        svg.appendChild(g);
      });
    });
  }, [components]);

  return <svg ref={svgRef} width="100%" height="500" />;
}