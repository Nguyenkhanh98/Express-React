const config = {
    dev: {

        API_ENDPOINT: 'http://localhost:8080/api',
        BASE_URL: 'http://localhost:8080/',
        USER_ENDPOINT: '/user',
        CLASS_ENDPOINT: '/class',
        GRADE_ENDPOINT: '/grade',
        SUBJECT_ENDPOINT: '/subject',

    },
    prod: {
        API_ENDPOINT: '/api',
        BASE_URL: '/',
        USER_ENDPOINT: '/user',
        CLASS_ENDPOINT: '/class',
        SUBJECT_ENDPOINT: '/subject',
        GRADE_ENDPOINT: '/grade',

    }
}

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

export default config[env];
