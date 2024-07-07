const Word = require('./word.model');
const User = require('../user/user.model');

exports.getSearchWords = async (searchTerm) => {
    try {
        // 대소문자 구분 없이 검색어를 찾기 위한 정규 표현식 사용
        const escapedSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const searchWords = await Word.findOne({ word: { $regex: `^${escapedSearchTerm}$`, $options: 'i' } });

        if (!searchWords) {
            console.log('Search term not found in Word collection');
        }
        console.log(888, searchWords);
        return searchWords;
    } catch (error) {
        console.log('Error while getting search words:', error);
        return null;
    }
};

exports.getRankWords = async () => {
    try {
        const words = await Word.find().sort({ freq: -1 }).limit(10);
        const wordNames = words.map((word) => word.word);
        return wordNames;
    } catch (error) {
        console.log('Error while getting rank words:', error);
        return null;
    }
};

exports.getRelatedWords = async (searchTerm, limit) => {
    try {
        const relatedWords = await Word.find({ word: new RegExp(searchTerm, 'i') })
            .sort({ freq: -1 })
            .limit(parseInt(limit));
        const wordNames = relatedWords.map((word) => word.word);
        return wordNames;
    } catch (error) {
        console.log('Error while getting related words:', error);
        return null;
    }
};

exports.addWord = async (requestId, formData) => {
    try {
        // requestId에 해당하는 request를 찾습니다.
        console.log("addWord 진입!!!!!!!!", requestId, formData)
        const user = await User.findOne({ 'requests._id': requestId });
        if (!user) {
            console.log('User with the given request not found');
            return null;
        }

        const request = user.requests.id(requestId);
        if (!request) {
            console.log('Request not found');
            return null;
        }


        const newWord = new Word({
            word: formData.devTerm,
            awkPron: formData.awkPron,
            comPron: formData.commonPron,
            info: formData.addInfo,
            suggestedBy: request.suggestedBy,
        });

        await newWord.save();

        console.log('Word added successfully');

    } catch (error) {
        console.log('Error while adding word:', error);
        return null;
    }
};

exports.updateWord = async (requestId, formData) => {
    try {
        // requestId에 해당하는 request를 찾습니다.
        console.log("updateWord 레포진입!!!!!!!!!!!!", requestId, formData)
        const user = await User.findOne({ 'requests._id': requestId });
        if (!user) {
            console.log('User with the given request not found');
            return null;
        }

        const request = user.requests.id(requestId);
        if (!request) {
            console.log('Request not found');
            return null;
        }
        // request.word와 같은 word를 Word 스키마에서 찾습니다.
        const wordToUpdate = await Word.findOne({ word: request.word });
        if (!wordToUpdate) {
            console.log('Word not found in Word collection');
            return null;
        }

        // word 데이터를 request 데이터로 업데이트합니다.
        wordToUpdate.awkPron = formData.awkPron;
        wordToUpdate.comPron = formData.commonPron;
        wordToUpdate.info = formData.addInfo;
        wordToUpdate.suggestedBy = request.suggestedBy;

        await wordToUpdate.save();

        console.log('Word updated successfully');
        return wordToUpdate;

    } catch (error) {
        console.log('Error while updating word:', error);
        return null;
    }
};