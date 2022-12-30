// import { PageType } from '../pages';
export const generateGlobalPaneId = (
  menuType: string,
  pageType: string,
  rawId: React.Key
) => btoa(encodeURI(`${menuType}__${pageType}__${rawId}`));

export const parseGlobalPaneId = (paneId?: string) => {
  try {
    paneId = paneId || '';
    const arr = atob(decodeURI(paneId)).split('__');
    return {
      menuType: arr[0],
      pageType: arr[1],
      rawId: arr[2],
    };
  } catch (e) {
    return {
      menuType: 'arr[0]',
      pageType: 'arr[1]',
      rawId: 'arr[2]',
    };
  }
};
