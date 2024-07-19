import { Outlet } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { darkTheme } from './theme';
import { RecoilRoot } from 'recoil';

const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Indie Flower";
    background-color: ${(props) => props.theme.bgColor};
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <RecoilRoot>
        <GlobalStyle />
        <Outlet />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
