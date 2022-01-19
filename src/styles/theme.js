const theme = {
  colors: {
    primary: "#7CD0C2",
    primaryOpacity: (opacity=1) => `rgba(124, 208, 194, ${opacity})`,
    primaryFilter: "filter: invert(93%) sepia(8%) saturate(1947%) hue-rotate(105deg) brightness(88%) contrast(84%);",
    secondary: "#5982E3",
    secondaryOpacity: (opacity=1) => `rgba(89, 130, 227, ${opacity})`,
    background: "#2b2b2b",
    backgroundOpacity: (opacity=1) => `rgba(43, 43, 43, ${opacity})`,
  },
  fonts: {
    display: "Ubuntu, sans-serif",
    normal: "Montserrat, sans-serif",
    code: "'Ubuntu Mono', monospace",
  }
}

export default theme;