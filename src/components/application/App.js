import React from 'react';
import { css } from "@emotion/core";
import Providers from "@components/application/Providers";
import Navbar from "@components/layout/Navbar";
import CodeScreen from "@screens/CodeScreen";

function App() {
  return (
    <Providers>
      <div 
        className="App"
        css={appStyles}>
        <Navbar />
        <CodeScreen />
      </div>
    </Providers>
  );
}

const appStyles = css`
  display: flex;
  flex-direction: column;
`


export default App;
