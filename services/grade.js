
const gradesJSON = require('../data/grades.json');

const grades = JSON.parse(JSON.stringify(gradesJSON));

const getListGrade = async ({ name = '', limit = 10, offset = 0 }) => {

    try {

        const result = [];

        grades.sort((a, b) => {
            const aId = a.level;
            const bId = b.level;
            return aId - bId;
        });

        const total = parseInt(offset) + parseInt(limit);

        for (let i = offset; i < total; i++) {
            if (grades[i]) {
                result.push(grades[i]);
            }
        }
        return {
            grades: result,
            count: grades.length
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getListGrade };
