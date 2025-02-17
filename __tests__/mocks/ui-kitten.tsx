jest.mock('@ui-kitten/components', () => ({
  List: ({data, renderItem}) => {
    if (!data || data.length === 0) {
      return <div>No watchers found</div>;
    }
    return data.map((item, index) => renderItem({item, index}));
  },
  ListItem: ({testID, description}) => <div data-testid={testID}>{description}</div>,
  Button: () => null,
  Divider: () => null,
}));

jest.mock('@eva-design/eva', () => ({
  light: {},
  dark: {},
}));
