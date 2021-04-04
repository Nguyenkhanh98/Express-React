const ClassModel = require('../models/classes');
const UserModel = require('../models/users');
const GradeModel = require('../models/grades');
const SubjectModel = require('../models/subjects');
const TranscriptModel = require('../models/transcript');
const RoleModel = require('../models/roles');

const fs = require('fs');
const path = require('path');
const pathToImgs = path.join(__dirname, 'Media');

const seedGrade = async () => {
    let gradeId = 0;
    const listGrades = [];

    for (let i = 6; i <= 9; i++) {
        gradeId++;
        let grade = GradeModel.schema;
        grade.id = gradeId;
        grade.level = i;
        listGrades.push({ ...{}, ...grade });
    }

    try {
        await fs.writeFileSync(`${__dirname}/grades.json`, JSON.stringify(listGrades), 'utf-8');
        console.log(' Seed grade model successfully');

    } catch (error) {
        console.log(' Cannot seed grade model');
    }
}


const seedClass = async () => {
    const classesTitle = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let listClasses = [];
    let classId = 0;
    const grades = await require("./grades.json");

    grades.forEach(gradeElement => {
        classesTitle.forEach(classTitle => {
            classId++;
            let classData = ClassModel.schema;
            classData.id = classId;
            classData.gradeId = gradeElement.id;
            classData.name = `${gradeElement.level}${classTitle}`;
            listClasses.push({ ...{}, ...classData });

        });

    });

    try {
        await fs.writeFileSync(`${__dirname}/classes.json`, JSON.stringify(listClasses), 'utf-8');
        console.log(' Seed class model successfully');

    } catch (error) {
        console.log(' Cannot seed class model');
    }
}

const seedUser = async () => {
    const listLastName = ['Hoa', 'Ngọc', 'Liễu', 'Nam', 'Tiến', 'Năm', 'Bốn',
        'Tùng', 'Xuân', 'Phương', 'Lượng', 'Thương', 'Thường', 'Phước', 'Sương', 'Liên', 'Chín',
        'Bảy', 'An', 'Phát', 'Huyền', 'Thuyên', 'Quyên', 'Quyền', 'Luyến', 'Tuyết', 'Tuyền', 'Bình', 'Ba', 'Bông',
        'Bống', 'Chanh', 'Chuối', 'Chong', 'Chảnh', 'Chóng', 'Em', 'Dũng', 'Diệu', 'Hà', 'Hạ', 'My', 'Mỹ',
        'Miều', 'Miễu', 'Xu', 'Uy', 'Uyên', 'Lũy'];

    const listFirstName = ['Nguyễn', 'Lê', 'Phạm', 'Phan', 'Mạc', 'Lương', 'Trần', 'Ngô', 'Lê', 'Hoàng', 'Huỳnh', 'Vũ'
        , 'Võ', 'Đặng', 'Đỗ', 'Hồ', 'Lý', 'Dương'];

    const listMiddleNameFemale = ['Thị', 'Thùy'];
    const listMiddleNameMale = ['Hữu', 'Văn', 'Khắc', 'Tài', 'Viết', 'Nguyên'];

    const city = 'Hồ Chí Minh';
    const districts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'Tân Bình', 'Bình thạnh', 'Thủ Đức', 'Gò Vấp', 'Cát lái', 'Nhà bè', 'Hóc môn', 'Củ chi'];
    const street = ['Lạc Long Quân', 'Lê Thái Tổ', 'Nguyễn Thị Thập', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'A1',
        'A2', 'A3', 'A4', 'Nguyễn Văn Cừ', 'Tôn Dật Tiên', 'Nguyễn Khoái', 'Nguyễn Biểu', ' Nguyễn Trãi', 'Nguyễn Tất Thành', 'Dương Bá Trạc',
        'Phùng Khắc Khoan', 'Tôn Thất Thuyết', 'Hồng Hà', 'Bạch Đằng', 'Hoàng Sa', 'Trường Sa'];

    let listUsers = [];
    let userId = 0;

    const classes = await require('./classes.json');
    const roles = await require('./roles.json');
    const allImgs = await fs.readdirSync(pathToImgs).filter((file) => (file.indexOf('.') !== 0));

    classes.forEach(classElement => {
        const limitUser = Math.floor(Math.random() * 3) + 18;

        for (let i = 0; i < limitUser; i++) {
            userId++;
            let randomNumberMale = Math.floor(Math.random() * 2);
            let randomNumberMiddle = Math.floor(Math.random() * 2);

            let user = UserModel.schema;
            let middleName = '';

            if (randomNumberMiddle > 0) {
                let listMiddleName = randomNumberMale > 0 ? [...listLastName, ...listMiddleNameMale] : [...listLastName, ...listMiddleNameFemale];
                for (let i = 0; i <= randomNumberMiddle; i++) {
                    middleName += ' ' + listMiddleName[Math.floor(Math.random() * listMiddleName.length)];
                }
            }

            middleName = middleName.split(' ').filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            }).join(' ');

            user.id = userId;
            user.classId = classElement.id;
            user.lastName = listLastName[Math.floor(Math.random() * listLastName.length)];
            user.firstName = listFirstName[Math.floor(Math.random() * listFirstName.length)];
            user.sex = randomNumberMale > 0 ? 'Male' : 'Female';
            user.middleName = middleName;
            user.cmnd = Math.floor(Math.random() * 99999999) + 200000000;

            let randomMonth = Math.floor(Math.random() * 12) + 1;
            randomMonth = randomMonth < 10 ? "0" + randomMonth : randomMonth;
            let randomDate = Math.floor(Math.random() * 29) + 1;
            randomDate = randomDate < 10 ? "0" + randomDate : randomDate;

            let grade = classElement.name.split('').shift();
            let age = 5 + parseInt(grade);
            let currentDate = new Date();
            user.dateOfBirdth = `${randomMonth}/${randomDate}/${currentDate.getFullYear() - age}`;



            user.avatar = allImgs[Math.floor(Math.random() * allImgs.length)];


            let randomHouseNumber = Math.floor(Math.random() * 300) + 1;
            let randomWard = Math.floor(Math.random() * 10) + 1;
            let randomStreet = street[Math.floor(Math.random() * street.length)];
            let randomDistrict = districts[Math.floor(Math.random() * districts.length)];

            user.address = `${randomHouseNumber} đường ${randomStreet} , phường ${randomWard}, quận ${randomDistrict}, ${city}`;

            user.roleId = roles[0].id;
            user.userName = `student${userId}`;
            user.password = `student${userId}`;

            const listPrePhoneNumber = ['088', '086', '036', '032', '097', '096', '095'];
            user.phone = `${listPrePhoneNumber[Math.floor(Math.random() * listPrePhoneNumber.length)]}${Math.floor(Math.random() * 8999999) + 1000000}`;

            listUsers.push({ ...{}, ...user });
        };
    });

    // seed Coach
    for (let i = 0; i < 10; i++) {
        userId++;

        let randomNumberMale = Math.floor(Math.random() * 2);
        let randomNumberMiddle = Math.floor(Math.random() * 2);

        let user = UserModel.schema;
        let middleName = '';

        if (randomNumberMiddle > 0) {
            let listMiddleName = randomNumberMale > 0 ? [...listLastName, ...listMiddleNameMale] : [...listLastName, ...listMiddleNameFemale];
            for (let i = 0; i <= randomNumberMiddle; i++) {
                middleName += ' ' + listMiddleName[Math.floor(Math.random() * listMiddleName.length)];
            }
        }

        middleName = middleName.split(' ').filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
        }).join(' ');

        user.id = userId;
        user.classId = null;
        user.lastName = listLastName[Math.floor(Math.random() * listLastName.length)];
        user.firstName = listFirstName[Math.floor(Math.random() * listFirstName.length)];
        user.male = randomNumberMale > 0 ? 'Male' : 'Female';
        user.middleName = middleName;
        user.cmnd = Math.floor(Math.random() * 99999999) + 200000000;

        let randomMonth = Math.floor(Math.random() * 12) + 1;
        randomMonth = randomMonth < 10 ? "0" + randomMonth : randomMonth;
        let randomDate = Math.floor(Math.random() * 29) + 1;
        randomDate = randomDate < 10 ? "0" + randomDate : randomDate;

        let age = Math.floor(Math.random() * 20) + 22;
        let currentDate = new Date();
        user.dateOfBirdth = `${randomMonth}/${randomDate}/${currentDate.getFullYear() - age}`;

        user.avatar = allImgs[Math.floor(Math.random() * allImgs.length)];


        let randomHouseNumber = Math.floor(Math.random() * 300) + 1;
        let randomWard = Math.floor(Math.random() * 10) + 1;
        let randomStreet = street[Math.floor(Math.random() * street.length)];
        let randomDistrict = districts[Math.floor(Math.random() * districts.length)];

        user.address = `${randomHouseNumber} đường ${randomStreet} , phường ${randomWard}, quận ${randomDistrict}, ${city}`;

        user.roleId = roles[1].id;
        user.userName = `coach${i + 1}`;
        user.password = `coach${i + 1}`;

        listUsers.push({ ...{}, ...user });
    }

    try {
        await fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(listUsers), 'utf-8');
        console.log(' Seed User model successfully');

    } catch (error) {
        console.log(' Cannot seed User model');
    }
}
const seedSubject = async () => {
    let subjectId = 0;
    const listSubjects = [];
    const ALlSubject = ['Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Giáo Dục Công Dân', 'Địa Lý', 'Lịch Sử', 'Ngữ Văn', 'Ngoại Ngữ'];
    const allAlias = ['Toan', 'Vatly', 'HoaHoc', 'SinhHoc', 'GiaoDucCongDan', 'DiaLy', 'LichSu', 'NguVan', 'NgoaiNgu'];
    for (let i = 0; i < 9; i++) {
        subjectId++;
        let subject = SubjectModel.schema;
        subject.id = subjectId;
        subject.name = ALlSubject[i];
        subject.alias = allAlias[i];
        listSubjects.push({ ...{}, ...subject });
    }

    try {
        await fs.writeFileSync(`${__dirname}/subjects.json`, JSON.stringify(listSubjects), 'utf-8');
        console.log(' Seed Subject model successfully');

    } catch (error) {
        console.log(' Cannot seed Subject model');
    }
}

const seedTranscript = async () => {
    const students = await require('./users.json');
    const subjects = await require('./subjects.json');
    const roles = await require('./roles.json');

    const listTranscripts = [];
    let transcriptId = 0;
    students.forEach(student => {

        if (student.roleId == roles[0].id) {
            subjects.forEach(subject => {
                transcriptId++;
                const mark = TranscriptModel.schema;
                mark.id = transcriptId;
                mark.subjectId = subject.id;
                mark.userId = student.id;
                const randomNumber = Math.floor(Math.random() * 11);
                if (randomNumber > 2) {
                    mark.score = Math.floor(Math.random() * 5) + 5;

                } else {
                    mark.score = Math.floor(Math.random() * 11);
                }
                listTranscripts.push({ ...mark });
            });
        }
    });

    try {
        await fs.writeFileSync(`${__dirname}/transcripts.json`, JSON.stringify(listTranscripts), 'utf-8');
        console.log(' Seed transcripts model successfully');

    } catch (error) {
        console.log(' Cannot seed Transcripts model');
    }
}

const renamestudentImage = async () => {

    const allImgs = await fs.readdirSync(pathToImgs).filter((file) => (file.indexOf('.') !== 0));
    console.log(allImgs);
    for (var i = 0; i < allImgs.length; i++) {
        const extension = allImgs[i].split('.').pop();
        console.log(i);
        fs.renameSync(pathToImgs + '/' + allImgs[i], pathToImgs + '/User_' + i + '.' + extension, function (err) {
            if (err) console.log('ERROR: ' + err);
        });
    }
}

const seedRole = async () => {
    const listRoles = [];
    const roleName = ['Student', 'Coach'];
    for (let i = 1; i < 3; i++) {
        let role = RoleModel.schema;
        role.id = i;
        role.name = roleName[i - 1];
        listRoles.push({ ...{}, ...role });
    }

    try {
        await fs.writeFileSync(`${__dirname}/roles.json`, JSON.stringify(listRoles), 'utf-8');
        console.log(' Seed Role model successfully');

    } catch (error) {
        console.log(' Cannot seed Role model');
    }
}

(async () => {
    await seedGrade();
    await seedClass();
    await renamestudentImage();
    await seedRole();
    await seedUser();
    await seedSubject();
    await seedTranscript();
})();