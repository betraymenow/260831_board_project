const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const auth = require('../middleware/auth');

// 게시글 작성(/board/write) - 로그인 필요
router.post('/write', auth, async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await Board.create({ title, content, writer: req.member.id });
        res.json({ success: true, data: result });
    } catch (e) {
        console.error(e);
        res.json({ success: false, msg: '필수값을 확인해 주세요' });
    }
});

// 게시글 목록(/board/list, /board/) - 페이지네이션 지원 (?page=1&limit=10)
router.get(['/list', '/'], async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const total = await Board.countDocuments();
    const list = await Board.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    res.json({ success: true, data: list, page, limit, total });
});

// 게시글 상세보기(/board/get/:id) - 조회수 증가
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();

    if (board == null) {
        return res.json({ success: false, msg: '없는 게시글' });
    }
    res.json({ success: true, data: board });
});

// 게시글 수정(/board/update/:id) - 작성자 본인만 수정 가능
router.put('/update/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const board = await Board.findById(id).lean();
    if (board == null) {
        return res.json({ success: false, msg: '없는 게시글' });
    }
    if (board.writer !== req.member.id) {
        return res.status(403).json({ success: false, msg: '작성자만 수정할 수 있습니다.' });
    }

    let update = {};
    if (title != undefined) update['title'] = title;
    if (content != undefined) update['content'] = content;

    const updated = await Board.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true
    }).lean();

    res.json({ success: true, msg: '수정에 성공 했습니다.', data: updated });
});

// 게시글 삭제(/board/delete/:id) - 작성자 본인만 삭제 가능
router.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;

    const board = await Board.findById(id).lean();
    if (board == null) {
        return res.json({ success: false, msg: '없는 게시글' });
    }
    if (board.writer !== req.member.id) {
        return res.status(403).json({ success: false, msg: '작성자만 삭제할 수 있습니다.' });
    }

    await Board.findByIdAndDelete(id);
    res.json({ success: true, msg: '게시글삭제 완료' });
});

module.exports = router;
