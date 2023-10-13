import "./App.css";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";

function initDiagram() {
  const $ = go.GraphObject.make;

  // 다이어그램 정의
  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true, // 모델 변경을 감지하기 위해 Undo/Redo 기능을 활성화
    // 'undoManager.maxHistoryLength': 0, // 되돌리기(undo) 및 다시 실행(redo) 기능
    "clickCreatingTool.archetypeNodeD ata": {
      // 빈 공간을 클릭할 때 생성되는 노드의 기본 데이터를 정의
      text: "new node",
      color: "lightblue",
      loc: "0 0", // 초기 위치 설정
    },
    model: new go.GraphLinksModel({
      linkKeyProperty: "key", // GraphLinksModel을 사용하여 노드와 링크의 데이터 모델을 정의,'key'는 링크를 식별하기 위한 속성을 정의, 이 속성은 병합과 데이터 동기화에 필요한 중요한 설정
    }),
  });

  // 노드 템플릿 정의 > 각 노드가 어떻게 보일지
  diagram.nodeTemplate = $(
    go.Node,
    "Auto", // 노드의 위치를 데이터와 바인딩, 노드의 위치가 변경될 때마다 모델 데이터도 업데이트
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify,
    ),
    $(
      // 노드의 모양을 정의
      go.Shape,
      "RoundedRectangle",
      // Shape.fill 은 Node.data.color 에 바인딩 됨
      { name: "SHAPE", fill: "white", strokeWidth: 0 },
      new go.Binding("fill", "color"),
    ),
    $(
      go.TextBlock,
      // 텍스트 주의에 약간의 공백
      { margin: 8, editable: true },
      new go.Binding("text").makeTwoWay(),
    ),
  );

  return diagram;
}

// GoJS 모델 변경 사항 처리
// React 상태를 업데이트할 수 있으며, 이에 대한 내용은 아래에서 논의
function handleModelChange(changes) {
  console.log("GoJS model changed:", changes);
}

export default function App() {
  return (
    <div>
      ...
      <ReactDiagram
        initDiagram={initDiagram} // 다이어그램 초기화
        divClassName="diagram-component"
        nodeDataArray={[
          { key: 0, text: "Alpha", color: "lightblue", loc: "0 0" },
          { key: 1, text: "Beta", color: "orange", loc: "150 0" },
          { key: 2, text: "Gamma", color: "lightgreen", loc: "0 150" },
          { key: 3, text: "Delta", color: "pink", loc: "150 150" },
        ]}
        linkDataArray={[
          { key: -1, from: 0, to: 1 },
          { key: -2, from: 0, to: 2 },
          { key: -3, from: 1, to: 1 },
          { key: -4, from: 2, to: 3 },
          { key: -5, from: 3, to: 0 },
        ]}
        onModelChange={handleModelChange}
      />
      ...
    </div>
  );
}
