import { extendTheme } from '@chakra-ui/react';
import lightTheme_ from './theme';
import darkTheme_ from './darkTheme';
import { createContext } from 'react';
const lightTheme = extendTheme(lightTheme_);
const darkTheme = extendTheme(darkTheme_);

const themeContext = createContext<Record<string, unknown>>(lightTheme);

export { lightTheme, darkTheme, themeContext };
