import React, { useEffect, useRef } from "react";
import go from "gojs";

function ProcessFlowDiagram() {
  const diagramRef = useRef(null);

  useEffect(() => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Spot",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify,
      ),
      $(
        go.Shape,
        "Rectangle",
        { fill: "white", strokeWidth: 2 },
        new go.Binding("fill", "color"),
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text").makeTwoWay(),
      ),
    );

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes, curve: go.Link.JumpOver },
      $(go.Shape, { strokeWidth: 2, stroke: "black" }),
    );

    diagram.model = new go.GraphLinksModel([
      { key: 1, text: "Alpha", color: "lightblue", loc: "0 0" },
      { key: 2, text: "Beta", color: "lightgreen", loc: "150 0" },
      { key: 3, text: "Gamma", color: "lightyellow", loc: "0 150" },
      { key: 4, text: "Delta", color: "lightcoral", loc: "150 150" },
      { key: 5, text: "Epsilon", color: "lightgoldenrodyellow", loc: "75 75" },
    ]);

    return () => {
      diagram.div = null;
    };
  }, []);

  return (
    <div
      id="myDiagramDiv"
      ref={diagramRef}
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
}

export default ProcessFlowDiagram;
