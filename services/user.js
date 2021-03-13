const fs = require('fs');
const path = require('path');
const { off } = require('../app');

const pathUser = 'data/Du_lieu/Nhan_vien';
const pathManager = 'data/Du_lieu/Quan_ly_Don_vi';

const pathToUser = path.join(__dirname, '..', pathUser);
const pathToManager = path.join(__dirname, '..', pathManager);

const getUsers = async () => {
    const NhanVienList = [];

    await fs.readdirSync(pathToUser).filter((file) => (file.indexOf('.') !== 0)
        && (file.slice(-5) === '.json')).forEach((file) => {
            NhanVienList.push(require(`../${pathUser}/${file}`));
        });
    return NhanVienList;
};


const getQuanLiDonVi = async () => {

    const quanLiDonViList = [];

    await fs.readdirSync(pathToManager).filter((file) => (file.indexOf('.') !== 0)
        && (file.slice(-5) === '.json')).forEach((file) => {
            quanLiDonViList.push(require(`../${pathManager}/${file}`));
        });
    return quanLiDonViList;
};

const saveUser = async (userName, data) => {
    const fs = require('fs');
    const path = require('path');

    try {
        await fs.writeFileSync(`${pathToUser}/${userName}.json`, data);
        return true;
    } catch (error) {
        return false;
    }
}

const logIn = async ({ userName, password }) => {
    try {
        const users = await getUsers();
        let user = null;
        console.log(users);
        users.forEach(currentUser => {
            if (currentUser.Ten_Dang_nhap === userName) {
                if (currentUser.Mat_khau === password) {
                    user = currentUser;
                }
            }
        })
        if (user) return user;

        const managers = await getQuanLiDonVi();

        managers.forEach(currentUser => {
            if (currentUser.Ten_Dang_nhap === userName) {
                if (currentUser.Mat_khau === password) {
                    user = currentUser;
                }
            }
        })
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
    }

};

const getByUserName = async ({ userName }) => {
    try {
        const users = await getUsers();
        let user = null;
        users.forEach(currentUser => {
            if (currentUser.Ten_Dang_nhap === userName) {
                user = currentUser;
            }
        })
        if (user) return user;

        const managers = await getQuanLiDonVi();

        managers.forEach(currentUser => {
            if (currentUser.Ten_Dang_nhap === userName) {
                user = currentUser;
            }
        })

        return user;
    } catch (error) {
        console.log(error);
    }
}

const updateByUserName = async ({ userName, address, phone }) => {
    try {
        const users = await getUsers();
        let user = null;


        users.forEach((currentUser, index) => {
            if (currentUser.Ten_Dang_nhap === userName) {
                users[index].Dien_thoai = phone;
                users[index].Dia_chi = address;
                user = users[index];
            }
        })
        if (user) {
            const updateUser = saveUser(userName, JSON.stringify(user));
            return updateUser;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getListUsers = async ({ name = '', limit = 10, offset = 0 }) => {
    try {
        const users = await getUsers();
        const listUserResult = [];
        users.forEach((currentUser, index) => {
            if (currentUser.Ho_ten.includes(name)) {
                currentUser.avatar = `${currentUser.Ten_Dang_nhap}.png`;
                listUserResult.push(currentUser);
            }
        });

        const result = [];
        listUserResult.sort((a, b) => {
            const aId = a.Ten_Dang_nhap.split('_').pop();
            const bId = b.Ten_Dang_nhap.split('_').pop();
            return aId - bId;
        });
        const total = parseInt(offset) + parseInt(limit);
        for (let i = offset; i < total; i++) {
            if (listUserResult[i]) {
                result.push(listUserResult[i]);
            }
        }
        return {
            users: result,
            count: listUserResult.length
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { logIn, getUsers, getByUserName, updateByUserName, getListUsers };