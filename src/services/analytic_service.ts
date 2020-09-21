import { SearchKeyword } from "../models/SearchKeyword";
import { SearchRequest } from "../models/SearchRequest";

export const recordSearchRequest = async (query: string) => {
  if (!query) return;

  const queryLower = query.toLowerCase().trim();
  const keyword =
    (await SearchKeyword.query().findOne({ value: queryLower })) ||
    (await SearchKeyword.query().insert({ value: queryLower }));

  return SearchRequest.query().insert({ searchKeywordId: keyword.id });
};
