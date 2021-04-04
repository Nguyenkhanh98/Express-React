import React, { useState, useEffect } from 'react';
import { toastr } from 'react-redux-toastr';

import IBox from '../theme/ibox';
import BreadCrumb from '../theme/breadcrum';
import TextField from '../theme/textField';
import ConfirmForm from '../theme/confirmForm';
import config from '../config';
import API from '../helpers/api';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import '@date-io/date-fns';
import DateFnsUtils from '@date-io/date-fns';

const MAXIMUM_SIZE = 48 * 48;
const customStyle = {
    img: {
        maxWidth: '12em',
        maxHeight: '12em',
    },
};

const Profile = (props) => {
    const { id } = props.match.params;
    const [user, setUser] = useState({
        cmnd: null,
        address: null,
        phone: null,
        donVi: null,
        sex: null,
        name: null,
        maSo: null,
        mail: null,
        avatar: null
    });

    const [role, setRole] = useState(null);

    const [isRequest, setIsRequest] = useState(false);

    const [avatarState, setAvatar] = useState({
        file: '',
        previewUrl: '',
        helperText: '',
        placeHolder: '',
    });



    const loadInfo = async () => {
        const userLocal = JSON.parse(localStorage.getItem('user'));
        const role = userLocal.role;

        setRole(role);
        try {
            const getUserProfile = await API.get(`${config.USER_ENDPOINT}/${userLocal.userName}`);
            const { user } = getUserProfile.data;

            const { address, cmnd, dateOfBirdth, firstName, lastName, sex, middleName, avatar, phone } = user;
            const userClass = user.class;

            setUser({
                cmnd,
                address,
                sex,
                name: firstName + middleName + ' ' + lastName,
                class: userClass.name,
                grade: userClass.grade.level,
                avatar,
                phone,
                dateOfBirdth
            });

            setAvatar({
                ...avatarState,
                file: '',
                previewUrl: config.BASE_URL + avatar,
                placeHolder: 'Choose file... ',
            })
        } catch (error) {
            toastr.error(
                'something wrong'
            );
        }
    };

    const onChangeField = ({ target }) => {
        const { value, name } = target;

        setUser({ ...user, [name]: value });
    }

    const readFileAsync = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onChangeImage = async ({ target }) => {
        const file = Array.from(target.files)[0];
        if (!file) {
            return;
        }

        if (file.size / 1024 > MAXIMUM_SIZE) {
            setAvatar({
                ...avatarState,
                isError: true,
                helperText: 'Image size is over',
            });
            return;
        }
        const regexCheckImgType = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
        const isValid = regexCheckImgType.test(file.name);
        if (!isValid) {
            setAvatar({
                ...avatarState,
                isError: true,
                helperText: 'Invalid image type',
            });
            return;
        }

        const imgPreviewUrl = await readFileAsync(file);
        const formData = new FormData();
        formData.append('avatar', file);

        setAvatar({
            previewUrl: imgPreviewUrl,
            file: file,
            placeHolder: file.name,
            isError: false,
        });
    };

    const onSubmit = async () => {
        setIsRequest(true);
        const userLocal = JSON.parse(localStorage.getItem('user'));
        let updateAvatar;
        let params = {};
        try {
            if (avatarState.file) {
                const formData = new FormData();
                formData.append('avatar', avatarState.file);
                updateAvatar = await API.post(`${config.USER_ENDPOINT}/avatar`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (!updateAvatar) {
                    setIsRequest(false);
                    toastr.error(
                        'Cannot upload avatar',
                    );
                    return;
                }
            }

            if (updateAvatar) {
                const { data } = updateAvatar.data;

                params.avatar = data.url;
            }
            params.phone = user.phone;
            params.address = user.address;
            const updateUser = await API({
                url: `${config.USER_ENDPOINT}/${userLocal.userName}`,
                data: params,
                method: 'PUT'
            });
            if (updateUser) {
                toastr.success('Successful');
                setIsRequest(false);

            }
        } catch (error) {
            setIsRequest(false);
            console.log(error);
            toastr.error('something went wrong');
        }
    };


    useEffect(() => {
        loadInfo();
    }, []);

    const breadCrumbData = [
        { label: 'Edit profile', path: '/profile' },
    ];
    const { name, avatar, address, cmnd, phone, donVi, dateOfBirdth, grade, sex } = user;
    const userClass = user.class;


    const { isError, helperText, previewUrl, placeHolder } = avatarState;


    const warningImg = isError ? (
        <div style={{ color: 'red' }}>{helperText}</div>
    ) : null;

    const imagePreview = previewUrl ? <img src={previewUrl} style={customStyle.img} /> : null;
    // const imagePreview = <img src={config.BASE_URL + avatar} />;

    return (
        <>
            <BreadCrumb
                title={'Edit profile'}
                items={breadCrumbData}
            />
            <IBox
                title={'Edit profile'}
                subTitle={'Edit profile'}
            >
                <TextField
                    label={'Name'}
                    disabled
                    value={name}
                />
                <div className="hr-line-dashed" />
                <TextField
                    label={'CMND'}
                    disabled
                    value={cmnd}
                />
                <div className="hr-line-dashed" />
                <TextField
                    label={'Sex'}
                    disabled
                    value={sex}
                />
                <div className="hr-line-dashed" />

                <div className="form-group row" >
                    <label className={`col-form-label align-self-end col-sm-2`}>
                        Date of birdth
                    </label>
                    <div className='col-sm-10' >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                format="dd/MM/yyyy"
                                disabled
                                value={dateOfBirdth}
                                // onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className="hr-line-dashed" />
                {
                    (role === 'Student') &&
                    (<>
                        <TextField
                            label={'Class'}
                            disabled
                            value={userClass}
                        />
                        <div className="hr-line-dashed" />

                        <TextField
                            label={'Grade'}
                            disabled
                            value={grade}

                        />
                        <div className="hr-line-dashed" />

                    </>

                    )
                }

                <TextField
                    label={'Address'}
                    value={address}
                    name='address'
                    onChange={onChangeField}

                />
                <div className="hr-line-dashed" />

                <TextField

                    label={'Phone number'}
                    value={phone}
                    type='tel'
                    name='phone'

                    onChange={onChangeField}
                />
                <div className="hr-line-dashed" />

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">
                        Avatar
					</label>

                    <div className="col-sm-3">
                        <div className="custom-file">
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                onChange={onChangeImage}
                                className="custom-file-input"
                            />
                            <label
                                htmlFor="avatar"
                                className="custom-file-label"
                                style={{ overflow: 'hidden' }}
                            >
                                {placeHolder}
                            </label>
                            <span className="form-text m-b-none">
                                Image size(48x48).
							</span>
                        </div>
                    </div>
                    <div className="col-sm-7">
                        {imagePreview}
                        {warningImg}
                    </div>
                </div>

                <div className="hr-line-dashed" />
                <ConfirmForm
                    redirect="/"
                    onSubmit={onSubmit}
                    onLoad={isRequest}
                    cancelLabel={'Cancel'}
                    submitLabel={'Update'}

                />

            </IBox>
        </>
    );
};

export default Profile;
