const wordRepository = require('./word.repository');

// 검색 결과 조회
exports.getSearchWords = async (searchTerm) => {
    const searchWords = await wordRepository.getSearchWords(searchTerm);
    return searchWords;
};

// 인기검색어 조회
exports.getRankWords = async () => {
    const rankWords = await wordRepository.getRankWords();
    return rankWords;
};

// 연관검색어 조회
exports.getRelatedWords = async (searchTerm, limit) => {
    const relatedWords = await wordRepository.getRelatedWords(searchTerm, limit);
    return relatedWords;
};

// 전체 단어 목록 조회 & 정렬 (최초 로딩시, 최신순 정렬)
exports.getAllWords = async (Sort = 'recent', page = 1, limit = 10) => {
    const words = await wordRepository.getAllWords(Sort, page, limit);
    return words;
};
