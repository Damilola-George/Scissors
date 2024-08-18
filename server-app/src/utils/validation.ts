import validUrl from 'valid-url';

export const isValidUrl = (url: string): boolean => {
  return validUrl.isUri(url) ? true : false;
};

