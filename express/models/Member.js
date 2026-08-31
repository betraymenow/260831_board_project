// mongoose 는 스키마 설정이 가능하다.(테이블 형태)
const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, '아이디는 필수 입니다.'],
        unique: true, // 중복허용 안함
        trim: true,
        minlength: [4, '아이디는 4자 이상 입니다.'],
        maxlength: [25, '아이디는 25자 이하 입니다.']
    },
    pw: {
        type: String,
        required: [true, '비밀번호는 필수 입니다.'],
        trim: true,
        select: false // 조회할때 기본적으로 빼고 가져온다.
    },
    name: {
        type: String,
        required: [true, '이름은 필수 입니다.'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    grade: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, {
    collection: 'member',
    timestamps: true,
    id: false
});

schema.index({ name: 1 });
// model명은 단수형 파스칼 표기법을 사용 한다.
module.exports = mongoose.model('Member', schema);
