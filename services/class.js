
const gradesJSON = require('../data/grades.json');


const classesJSON = require('../data/classes.json');

const classes = JSON.parse(JSON.stringify(classesJSON));
const grades = JSON.parse(JSON.stringify(gradesJSON));

const getListClass = async ({ name = '', grade = null, limit = 10, offset = 0 }) => {
    let listClassResult = [];

    try {
        if (grade) {
            const thisGrade = grades.find(gradeElm => gradeElm.id == grade);
            classes.forEach((currentClass, index) => {
                if (currentClass.name.toUpperCase().includes(name.toUpperCase())) {
                    if (thisGrade.id === currentClass.gradeId) {
                        listClassResult.push({ ...{}, ...currentClass });
                    }
                }
            });
        } else {
            classes.forEach((currentClass, index) => {
                if (currentClass.name.toUpperCase().includes(name.toUpperCase())) {
                    listClassResult.push(currentClass);
                }
            });
        }
        const result = [];

        listClassResult.sort((a, b) => {
            const aId = a.name;
            const bId = b.name;
            return aId - bId;
        });

        const total = parseInt(offset) + parseInt(limit);

        for (let i = offset; i < total; i++) {
            if (listClassResult[i]) {
                result.push(listClassResult[i]);
            }
        }
        return {
            classes: result,
            count: listClassResult.length
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getListClass };
