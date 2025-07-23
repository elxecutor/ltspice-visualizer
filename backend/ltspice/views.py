from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def parse_netlist(request):
    netlist = request.data.get('netlist', '')
    components = []
    nodes = set()
    connections = []

    for line in netlist.splitlines():
        tokens = line.strip().split()
        if len(tokens) < 3: continue
        name, n1, n2, *rest = tokens
        comp_type = name[0].upper()
        value = rest[0] if rest else ""
        components.append({
            "name": name,
            "type": comp_type,
            "from": n1,
            "to": n2,
            "value": value
        })
        nodes.update([n1, n2])
        connections.append({
            "source": f"{name}:1",
            "target": f"{name}:2",
            "net": f"{n1}_{n2}"
        })

    return Response({
        "nodes": list(nodes),
        "components": components,
        "connections": connections
    })
