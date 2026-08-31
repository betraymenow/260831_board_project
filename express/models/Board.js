const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '제목은 필수 입니다.'],
        trim: true,
        maxlength: [100, '제목은 100자 이하 입니다.']
    },
    content: {
        type: String,
        required: [true, '내용은 필수 입니다.']
    },
    writer: {
        type: String, // 작성자의 member.id
        required: [true, '작성자는 필수 입니다.']
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    collection: 'board',
    timestamps: true,
    id: false
});

schema.index({ createdAt: -1 });
module.exports = mongoose.model('Board', schema);
