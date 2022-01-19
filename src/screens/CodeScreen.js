import React, { useState, useRef, useEffect } from "react"
/**@jsx jsx */
/** @jsxFrag Preact.Fragment */
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import MonacoEditor from"react-monaco-editor";
import { Resizable } from "re-resizable";
import deepEqual from "deep-equal";
import axios from "axios";
import snakeCaseKeys from "snakecase-keys";
import { edit } from "ace-builds";


const CodeScreen = () => {
  const [editor, setEditor] = useState(null);
  const [editorPanelSize, setEditorPanelSize] = useState({
    width: window.screen.width * 0.6,
    height: window.screen.height * 0.7,
    lastWidth: 0,
    lastHeight: 0,
  });

  const [editorState, setEditorState] = useState({
    language: "javascript",
    code: `\n/**\n*\n*\n*\n*/\n\nconst bubbleSort = (numberArr) => {\n\n  return;\n}\n`,
    runScript: "\nconst runTest = (context) => {\nreturn bubbleSort(...context.args);\n}\n",
    solutionCode: "const swap = (array, index1, index2) => {\nconst temp = array[index1];\narray[index1] = array[index2];\narray\n[index2] = temp;\n}\nconst bubbleSort = (numberArr) => {\nlet swapped = true;\nwhile(swapped) {\nswapped = false;\nfor(let i = 1; i < numberArr.length; i++) {\nif(numberArr[i] < numberArr[i - 1]) {\nswap(numberArr, i, i - 1);\nswapped = true;\n}\n}\n}\nreturn numberArr;\n}",
  });

  const [testCase, setTestCase] = useState({
    arguments: [[1,4,6,8,3,5,8,2]],
    expected: [1, 2, 3, 4, 5, 6, 8, 8],
  });

  const [userArguments, setUserArguments] = useState(reduceTestArgs());
  const [output, setOutput] = useState(null);
  const [solutionOutput, setSolutionOutput] = useState(null);

  const editorDidMount = (editor, monaco) => {
    // set editor to state for resizing
    setEditor(editor);

    // import theme
    import('monaco-themes/themes/Solarized-dark.json')
      .then(data => {
          monaco.editor.defineTheme("solarized-dark", data);
          monaco.editor.setTheme("solarized-dark");
      })

    // update tab size
    editor.getModel().updateOptions({ tabSize: 2 });
    
    // output mounted
    console.log("Editor Mounted");
  }

  const handleCodeChange = (value) => {
    setEditorState({ ...editorState, code: value });
  }

  const handleEditorSizeChange = (addedHeight, addedWidth) => {
    // if(editor) editor.layout();

    setEditorPanelSize({
      width: editorPanelSize.width + addedWidth - editorPanelSize.lastWidth,
      height: editorPanelSize.height + addedHeight - editorPanelSize.lastHeight,
      lastWidth: addedWidth,
      lastHeight: addedHeight,
    });
  }

  const handleTestArgChange = (event) => setUserArguments(event.target.value);

  const onSubmit = () => {
    let args;
    try {
      args = parseUserArgs();
    } catch {
      alert("Sorry, but this JSON is bad bro");
      return;
    }

    const data = snakeCaseKeys({
      language: editorState.language,
      code: editorState.code,
      solutionCode: editorState.solutionCode,
      runScript: editorState.runScript,
      arguments: args,
    })

    axios.post("/api/run_scripts", data)
      .then((res) => {
        setSolutionOutput(res.data.data[0].attributes);
        setOutput(res.data.data[1].attributes);
      })
      .catch(console.log);
  }

  function parseUserArgs() {
    const args = userArguments
      .split("\n")
      .filter((str) => str !== "")
      .join(",");

    return `[${args}]`;
  }

  function reduceTestArgs() {
    return testCase.arguments.reduce((acc, arg) => {
      return acc.concat(`${JSON.stringify(arg)}\n`)
    }, "")
  }

  const renderConsole = () => {
    if(!output) return;
    else if(output.stdout.length > 0) {
      return output.stdout.map((item, index) => (
        <div key={index}>
          { `${JSON.stringify(item)}` }
        </div>
      ))
    }
  }

  const renderOutput = () => {
    if(!output) return;
    else if(output.error) {
      return (
        <pre css={css`font-family: inherit;`}>
          {`Error:\n\n${output.error}`}
        </pre>
      )
    } else if(solutionOutput.return === null) {
      return `Error: invalid test case input`;
    }
    else {
      const isEqual = deepEqual(
        output.return,
        solutionOutput.return,
        { strict: true },
      );

      return (
        <div>
          <br/>
          Result: { JSON.stringify(output.return) }
          <br/>
          <br/>
          { isEqual ? `Test passed in ${output.runTime.toFixed(3)} ms` : "Test failed " } 
        </div>
      )
    }
  }

  return (
    <Container>
      <ContentPanel>
        <Title>Bubble Sort</Title>
        The left panel is here to describe how the bubble sort problem!
      </ContentPanel>
      <EditorPanel>
        <Resizable
          size={{ width: editorPanelSize.width, height: editorPanelSize.height }}
          maxWidth={window.screen.width * 0.75}
          maxHeight={window.screen.height * 0.7}
          minWidth={500}
          minHeight={150}
          enable={{ top: false, right: false, left: true, bottom: true }}
          onResizeStop={() => setEditorPanelSize({
            ...editorPanelSize,
            lastWidth: 0,
            lastHeight: 0,
          })}
          onResize={(e, direction, ref, d ) => {
            handleEditorSizeChange(d.height, d.width);
          }}>
          <MonacoEditor
            width={`${editorPanelSize.width}px`}
            height={`${editorPanelSize.height}px`}
            language={editorState.language}
            theme="vs-dark" // <-- technically being set above
            value={editorState.code}
            options={{
              minimap: { enabled: false },
            }}
            onChange={handleCodeChange}
            editorDidMount={editorDidMount}
          />
        </Resizable>
        <EditorInputs>
          <TestCase 
            value={userArguments}
            onChange={handleTestArgChange}>
          </TestCase>
          <StdOut>
            Console Output
            { renderConsole() }
          </StdOut>
          <OutPut>
            <SubmitButton onClick={onSubmit} >Submit</SubmitButton>
            <br/>
            { solutionOutput 
              && solutionOutput.error === null 
              && `Expected: ${JSON.stringify(solutionOutput.return)}`
            }
            <br/>
            { renderOutput() }
          </OutPut>
        </EditorInputs>
      </EditorPanel>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: calc(100% - 3rem);
`

const ContentPanel = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  border-right: 1px solid rgba(0,0,0,0.25);
`

const Title = styled.h1`
  font-family: ${({theme}) => theme.fonts.display};
  letter-spacing: 0.5px;
`
  
const EditorPanel = styled.div`
  display: flex;
  flex-direction: column;
`

const EditorInputs = styled.div`
  display: flex;
  height: 100%;
  background-color:	#F8F8F8;
`

const TestCase = styled.textarea`
  width: calc(100%/3);
  padding: 1rem;
  border-right: 1px solid rgba(0,0,0,0.25);
  resize: none;
  font-family: ${({theme}) => theme.fonts.code};
  font-size: 18px;
  letter-spacing: 1px;
`
  
const StdOut = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100%/3);
  padding: 1rem;
  border-right: 1px solid rgba(0,0,0,0.25);
  font-family: ${({theme}) => theme.fonts.code};
  font-size: 18px;
  letter-spacing: 1px;
`

const OutPut = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 0;
  overflow-wrap: anywhere;
  width: calc(100%/3);
  padding: 1rem;
  font-family: ${({theme}) => theme.fonts.code};
  font-size: 18px;
  letter-spacing: 1px;
`

const SubmitButton = styled.button`
  cursor: pointer;
`


export default CodeScreen;