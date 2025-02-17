/* eslint-env jest */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Mock UI Kitten components
jest.mock('@ui-kitten/components', () => ({
  List: ({data, renderItem}) => {
    if (!data || data.length === 0) {
      return 'No watchers found';
    }
    return data.map((item, index) => renderItem({item, index}));
  },
  ListItem: ({testID, description}) => description,
  Button: () => null,
  Divider: () => null,
}));

// Mock Eva Design
jest.mock('@eva-design/eva', () => ({
  light: {
    'color-primary-500': '#3366FF',
    'color-primary-600': '#284DE0',
    'color-primary-700': '#2745BF',
    'text-basic-color': '#FFFFFF',
    'text-hint-color': '#8F9BB3',
    'background-basic-color-1': '#222B45',
    'border-basic-color-5': '#101426',
  },
  dark: {},
}));

// Mock UI Kitten components with React elements
jest.mock('@ui-kitten/components', () => {
  const React = require('react');
  const actual = jest.requireActual('@ui-kitten/components');

  return {
    ...actual,
    List: ({data, renderItem}) => {
      if (!data || data.length === 0) {
        return 'No watchers found';
      }
      return data.map((item, index) => renderItem({item, index}));
    },
    ListItem: ({testID, description}) => description,
    Button: () => null,
    Divider: () => null,
    ApplicationProvider: ({children}) =>
      React.createElement(React.Fragment, null, children),
    Layout: ({children, ...props}) =>
      React.createElement('div', props, children),
    Text: ({children, ...props}) =>
      React.createElement('span', props, children),
  };
});
