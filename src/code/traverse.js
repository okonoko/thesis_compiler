// post order ast walker
export default function traverse(nodes, visitor){
    nodes = Array.isArray(nodes) ? nodes : [nodes];
    nodes.forEach(node => {
      Object.keys(node).forEach((prop) => {
        const value = node[prop];
        const valueAsArray = Array.isArray(value) ? value : [value];
        valueAsArray.forEach((childNode) => {
          if (typeof childNode.type === "string") {
            traverse(childNode, visitor);
          }
        });
      });
      visitor(node);
    });
};
  