const dotenv = require('dotenv');

const env = dotenv.config();
if (env.error) {
    console.warn('.env 파일을 찾을 수 없습니다.');
}

const conf = {
    port: process.env.PORT,
    corsWhiteList: process.env.CORS_WHITELIST,
    mongoURL: process.env.MONGO_URL,
};

module.exports = conf;
