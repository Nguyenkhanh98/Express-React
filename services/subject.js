
const subjectJSON = require('../data/subjects.json');

const subjects = JSON.parse(JSON.stringify(subjectJSON));

const getListSubject = async ({ limit = 10, offset = 0 }) => {

    try {

        const result = [];

        subjects.sort((a, b) => {
            const aId = a.name;
            const bId = b.name;
            return aId - bId;
        });

        const total = parseInt(offset) + parseInt(limit);

        for (let i = offset; i < total; i++) {
            if (subjects[i]) {
                result.push(subjects[i]);
            }
        }
        return {
            subjects: result,
            count: subjects.length
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getListSubject };
