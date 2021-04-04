const usersJSON = require('../data/users.json');
const rolesJSON = require('../data/roles.json');
const gradesJSON = require('../data/grades.json');
const classesJSON = require('../data/classes.json');
const { markService } = require('./');


const users = JSON.parse(JSON.stringify(usersJSON));
const roles = JSON.parse(JSON.stringify(rolesJSON));
const grades = JSON.parse(JSON.stringify(gradesJSON));
const classes = JSON.parse(JSON.stringify(classesJSON));

const fs = require('fs');
const path = require('path');

let studentRole = roles.find(role => role.name === 'Student');

const logIn = async ({ userName, password }) => {
    try {
        let user = null;
        users.forEach(currentUser => {
            if (currentUser.userName === userName) {
                if (currentUser.password === password) {

                    let userRole = roles.find(role => role.id == currentUser.roleId);
                    user = { ...currentUser, role: userRole };
                }
            }
        })
        if (user) return user;

    } catch (error) {
        console.log(error);
    }

};

const saveUser = async (data) => {
    return await fs.writeFileSync(path.join(__dirname, '../data/users.json'), data);
};

const getByUserName = async ({ userName }) => {
    try {
        let user = null;
        users.forEach(currentUser => {
            if (currentUser.userName === userName) {

                let userRole = roles.find(role => role.id == currentUser.roleId);
                let userClass = classes.find(classElm => classElm.id == currentUser.classId);

                let extraData = userRole.name == 'Coach' ? {} : grades.find(grade => grade.id == userClass.gradeId);

                user = { ...currentUser, role: userRole, class: { ...userClass, grade: extraData } };
            }
        });

        if (user) return user;
    } catch (error) {
        console.log(error);
    }
}


const updateByUserName = async ({ userName, address, phone, avatar, classId }) => {
    try {
        let user = null;
        users.forEach((currentUser, index) => {
            if (currentUser.userName === userName) {
                users[index].phone = phone;
                users[index].address = address;
                users[index].avatar = avatar || users[index].avatar;
                users[index].classId = classId || users[index].classId;
                user = users[index];
            }
        })
        if (user) {
            await saveUser(JSON.stringify(users));
            return user;
        }
        return false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

const getListUsers = async (params) => {
    const name = params.name || '';
    const offset = params.offset || 0;
    const limit = params.limit || 10;
    const gradeId = params.grade || null;
    const classId = params.class || null;

    let listUserResult = [];



    if (classId) {
        users.forEach(eachUser => {
            const fullName = eachUser.firstName + eachUser.middleName + ' ' + eachUser.lastName;
            if (fullName.toUpperCase().includes(name.toUpperCase())) {
                if (eachUser.classId == classId && eachUser.roleId === studentRole.id) {
                    listUserResult.push({ ...eachUser });
                }
            }
        });
    } else if (gradeId) {
        const listClass = [];
        classes.forEach(eachClass => {
            if (eachClass.gradeId == gradeId) {
                listClass.push(eachClass.id);
            }
        });
        users.forEach(eachUser => {
            const fullName = eachUser.firstName + eachUser.middleName + ' ' + eachUser.lastName;

            if (fullName.toUpperCase().includes(name.toUpperCase())) {
                if (eachUser && eachUser.roleId === studentRole.id)
                    if (listClass.includes(eachUser.classId)) {
                        listUserResult.push({ ...eachUser });
                    }
            }
        });
    } else {
        users.forEach(eachUser => {
            const fullName = eachUser.firstName + eachUser.middleName + ' ' + eachUser.lastName;

            if (fullName.toUpperCase().includes(name.toUpperCase()) && eachUser.roleId === studentRole.id) {
                listUserResult.push({ ...eachUser });
            }
        });
    }

    const result = [];

    listUserResult.sort((a, b) => {
        const aId = a.userName.split('_').pop();
        const bId = b.userName.split('_').pop();
        return aId - bId;
    });

    const total = parseInt(offset) + parseInt(limit);


    for (let i = offset; i < total; i++) {
        if (listUserResult[i]) {
            let userRole = roles.find(role => role.id == listUserResult[i].roleId);

            let userClass = classes.find(classElm => classElm.id == listUserResult[i].classId);
            const grade = grades.find(grade => grade.id = userClass.gradeId);
            let extraData = { ...userClass, grade };
            const user = listUserResult[i];
            const combind = { ...user, class: JSON.parse(JSON.stringify(extraData)) };
            result.push(combind);
        }
    }
    return {
        users: result,
        count: listUserResult.length
    }
}

const getTotalUserByClass = (classId) => {
    const listUserResult = [];
    users.forEach(eachUser => {
        if (eachUser.classId == classId && eachUser.roleId === studentRole.id) {
            listUserResult.push({ ...eachUser });
        }
    });

    return {
        count: listUserResult.length
    }
}
module.exports = { logIn, getByUserName, updateByUserName, getListUsers, getTotalUserByClass };