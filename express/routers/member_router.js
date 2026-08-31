const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const auth = require('../middleware/auth');
const KEY = require('../middleware/key');

// 회원 가입(/member/join)
router.post('/join', async (req, res) => {
    const { id, pw, name, phone } = req.body;
    try {
        const hashed = await bcrypt.hash(pw, 10);
        let result = await Member.create({ id, pw: hashed, name, phone });
        let object = result.toObject();
        delete object.pw; // pw 는 결과값에서 제거하고 보여준다.
        res.json({ success: true, data: object });
    } catch (e) {
        console.error(e, 'CODE :' + e.code);
        let msg = '';
        switch (e.code) {
            case 11000:
                msg = '이미 사용중인 아이디 입니다.';
                break;
            default:
                msg = '필수값을 확인해 주세요';
        }
        res.json({ success: false, message: msg });
    }
});

// 로그인(/member/login) -> 성공시 JWT 발급
router.post('/login', async (req, res) => {
    const { id, pw } = req.body;
    const member = await Member.findOne({ id }).select('+pw').lean();

    if (member == null) {
        return res.json({ success: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    const match = await bcrypt.compare(pw || '', member.pw);
    if (!match) {
        return res.json({ success: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ id: member.id, name: member.name, grade: member.grade }, KEY, { expiresIn: '1d' });
    res.json({ success: true, token, data: { id: member.id, name: member.name, grade: member.grade } });
});

// 로그인 여부 확인(/member/check) - Authorization 헤더로 토큰 전달
router.get('/check', auth, (req, res) => {
    res.json({ success: true, loginYN: true, data: req.member });
});

// 회원 리스트(/member/list, /member/)
router.get(['/list', '/'], async (req, res) => {
    let list = await Member.find()
        .sort({ createdAt: -1 })
        .lean();
    res.json({ success: true, data: list });
});

// 회원정보 상세보기(/member/get/:id)
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    let member = await Member.findOne({ id }).lean();

    if (member == null) {
        return res.json({ success: false, data: { info: {}, msg: '없는 회원' } });
    }
    res.json({ success: true, data: { info: member, msg: '상세보기 완료' } });
});

// 회원정보 수정(/member/update/:id) - 본인만 수정 가능
router.put('/update/:id', auth, async (req, res) => {
    const { id } = req.params;
    if (req.member.id !== id) {
        return res.status(403).json({ success: false, msg: '본인 정보만 수정할 수 있습니다.' });
    }

    const { pw, name, phone } = req.body;
    let update = {};
    if (pw != undefined) update['pw'] = await bcrypt.hash(pw, 10);
    if (name != undefined) update['name'] = name;
    if (phone != undefined) update['phone'] = phone;

    const member = await Member.findOneAndUpdate({ id }, update, {
        new: true,
        runValidators: true
    }).lean();

    if (member == null) {
        return res.json({ success: false, msg: '없는 회원' });
    }
    res.json({ success: true, msg: '수정에 성공 했습니다.', data: member });
});

// 회원 삭제(/member/delete/:id) - 본인만 삭제 가능
router.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;
    if (req.member.id !== id) {
        return res.status(403).json({ success: false, msg: '본인만 탈퇴할 수 있습니다.' });
    }

    let member = await Member.findOneAndDelete({ id }).lean();
    if (member == null) {
        return res.json({ success: false, msg: '회원 없음' });
    }
    res.json({ success: true, msg: '회원삭제 완료', data: member });
});

module.exports = router;
