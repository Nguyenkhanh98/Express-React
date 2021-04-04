
const fs = require('fs');
const path = require('path');
const transcriptsJSON = require('../data/transcripts.json');

const transcripts = JSON.parse(JSON.stringify(transcriptsJSON));

const saveUser = async (data) => {
    return await fs.writeFileSync(path.join(__dirname, '../data/transcripts.json'), data);
};

const getMarkByUserId = async ({ id, limit = 10, offset = 0, subjectId }) => {

    try {

        const marks = [];
        if (subjectId) {
            transcripts.forEach(eachMark => {
                if (eachMark.userId == id && eachMark.subjectId == subjectId) {

                    mark = eachMark;
                }
            });
            return mark;
        } else {
            transcripts.forEach(eachMark => {
                if (eachMark.userId == id) {
                    marks.push({ ...eachMark });
                }
            });
        }


        const total = parseInt(offset) + parseInt(limit);

        const result = [];
        for (let i = offset; i < total; i++) {
            if (marks[i]) {
                result.push(marks[i]);
            }
        }
        return {
            marks: result,
            count: result.length
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getTotalMarkBySubject = ({ subjectId, min = 0, max = 10, isMaxEqual, isMinEqual }) => {
    let result = 0;
    let totalMarks = 0;
    const Maxoperator = isMaxEqual === 'false' ? '<' : '<=';
    const Minoperator = isMinEqual === 'false' ? '>' : '>=';

    const comparisonOperatorsHash = {
        '<': function (a, b) { return a < b; },
        '>': function (a, b) { return a > b; },
        '>=': function (a, b) { return a >= b; },
        '<=': function (a, b) { return a <= b; }
    };

    const minCompareFunc = comparisonOperatorsHash[Minoperator];
    const maxCompareFunc = comparisonOperatorsHash[Maxoperator];
    transcripts.forEach((eachMark, index) => {
        if (eachMark.subjectId == subjectId) {
            totalMarks++;
            if (minCompareFunc(eachMark.score, min) && maxCompareFunc(eachMark.score, max)) {
                result++;
            }
        }
    });
    return { total: result, allMarks: totalMarks };
}

const updateMark = async ({ userId, subjectId, score }) => {
    let isExist = false;
    let id;
    transcripts.forEach((eachMark, index) => {

        if (eachMark.userId === userId && eachMark.subjectId === subjectId) {
            id = index + 1;
            isExist = true;
            a = index;
            transcripts[index].score = score;
        }
    });

    if (!isExist) {
        id = transcripts.length + 2;
        transcripts.push({ id, userId, subjectId, score })
    }
    await saveUser(JSON.stringify(transcripts));
    return { id, userId, subjectId, score };
}

module.exports = { getMarkByUserId, updateMark, getTotalMarkBySubject };
