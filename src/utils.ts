export type NextHandler = (err?: Error) => void;

export const relativeUrl = (url: URL) => `${url.pathname}${url.search}`;
