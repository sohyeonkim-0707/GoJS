import React, { useEffect, useRef } from "react";
import go from "gojs";

function DiagramComponent() {
  const diagramRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    function init() {
      const $ = go.GraphObject.make;

      const diagram = $(go.Diagram, diagramRef.current, {
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(30, 20),
        "draggingTool.isGridSnapEnabled": true,
        "resizingTool.isGridSnapEnabled": true,
        "rotatingTool.snapAngleMultiple": 90,
        "rotatingTool.snapAngleEpsilon": 45,
        "undoManager.isEnabled": true,
        ModelChanged: (e) => {
          if (e.isTransactionFinished) updateAnimation();
        },
      });

      diagram.nodeTemplateMap.add(
        "Process",
        $(
          go.Node,
          "Auto",
          {
            locationSpot: new go.Spot(0.5, 0.5),
            locationObjectName: "SHAPE",
            resizable: true,
            resizeObjectName: "SHAPE",
          },
          new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
            go.Point.stringify,
          ),
          $(
            go.Shape,
            "Cylinder1",
            {
              name: "SHAPE",
              strokeWidth: 2,
              fill: $(go.Brush, "Linear", {
                start: go.Spot.Left,
                end: go.Spot.Right,
                0: "gray",
                0.5: "white",
                1: "gray",
              }),
              minSize: new go.Size(50, 50),
              portId: "",
              fromSpot: go.Spot.AllSides,
              toSpot: go.Spot.AllSides,
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify,
            ),
          ),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Center,
              textAlign: "center",
              margin: 5,
              editable: true,
            },
            new go.Binding("text").makeTwoWay(),
          ),
        ),
      );

      diagram.nodeTemplateMap.add(
        "Valve",
        $(
          go.Node,
          "Vertical",
          {
            locationSpot: new go.Spot(0.5, 1, 0, -21),
            locationObjectName: "SHAPE",
            selectionObjectName: "SHAPE",
            rotatable: true,
          },
          new go.Binding("angle").makeTwoWay(),
          new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
            go.Point.stringify,
          ),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Center,
              textAlign: "center",
              margin: 5,
              editable: true,
            },
            new go.Binding("text").makeTwoWay(),
            new go.Binding("angle", "angle", (a) =>
              a === 180 ? 180 : 0,
            ).ofObject(),
          ),
          $(go.Shape, {
            name: "SHAPE",
            geometryString:
              "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
            strokeWidth: 2,
            fill: $(go.Brush, "Linear", {
              0: "gray",
              0.35: "white",
              0.7: "gray",
            }),
            portId: "",
            fromSpot: new go.Spot(1, 0.35),
            toSpot: new go.Spot(0, 0.35),
          }),
        ),
      );

      // Link template
      diagram.linkTemplate = $(
        go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpGap,
          corner: 10,
          reshapable: true,
          toShortLength: 7,
        },
        new go.Binding("points").makeTwoWay(),
        // Shape elements for the link
        $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 7 }),
        $(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 5 }),
        $(go.Shape, {
          isPanelMain: true,
          stroke: "white",
          strokeWidth: 3,
          name: "PIPE",
          strokeDashArray: [10, 10],
        }),
        $(go.Shape, {
          toArrow: "Triangle",
          scale: 1.3,
          fill: "gray",
          stroke: null,
        }),
      );

      load();
    }

    function updateAnimation() {
      if (animationRef.current) animationRef.current.stop();
      const animation = new go.Animation();
      animation.easing = go.Animation.EaseLinear;
      diagramRef.current.links.each((link) =>
        animation.add(link.findObject("PIPE"), "strokeDashOffset", 20, 0),
      );
      animation.runCount = Infinity;
      animation.start();
      animationRef.current = animation;
    }

    function save() {
      const savedModel = diagramRef.current.model.toJson();
      // 여기에서 savedModel을 서버에 전송하거나 로컬 스토리지에 저장할 수 있습니다.
      console.log("Diagram saved:", savedModel);
    }

    function load() {
      // 여기에서 저장된 모델을 서버에서 불러오거나 로컬 스토리지에서 가져올 수 있습니다.
      // 불러온 모델을 다이어그램에 적용합니다.
      const savedModel = ""; // 불러온 모델 데이터 (서버에서 가져온 JSON 등)
      diagramRef.current.model = go.Model.fromJson(savedModel);
      console.log("Diagram loaded:", savedModel);
    }

    init();

    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, []); // Empty dependency array ensures that this effect runs once after the initial render

  return (
    <div
      id="myDiagramDiv"
      ref={diagramRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
}

export default DiagramComponent;
