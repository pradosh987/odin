import { SearchKeyword } from "../models/SearchKeyword";
import { SearchRequest } from "../models/SearchRequest";
import { ThemeVisit } from "../models/ThemeVisit";

export const recordSearchRequest = async (query: string) => {
  if (!query) return;

  const queryLower = query.toLowerCase().trim();
  const keyword =
    (await SearchKeyword.query().findOne({ value: queryLower })) ||
    (await SearchKeyword.query().insert({ value: queryLower }));

  return SearchRequest.query().insert({ searchKeywordId: keyword.id });
};

export const recordThemeVisit = (themeId: number) => ThemeVisit.query().insert({ themeId: themeId });
