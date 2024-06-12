export interface TagTypes {
  path: string;
  title: string;
  routes?: TagTypes;
}

export interface TabTypes {
  label: string | React.ReactNode;
  key: string;
}
