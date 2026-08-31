# 게시판 프로젝트

Express + MongoDB(Mongoose) 백엔드와 Next.js 프론트엔드로 구성된 회원/게시글 게시판입니다.

## 구조

```
board_project/
├── express/     # 백엔드 API (회원, 게시글, JWT 인증)
└── next_js/     # 프론트엔드 (Next.js App Router)
```

## 실행 방법

### 1. MongoDB
로컬에 MongoDB가 실행 중이어야 합니다 (`mongodb://localhost:27017`).

### 2. 백엔드 (express/)
```bash
cd express
npm install
cp .env.example .env   # JWT_SECRET 값을 채워주세요
npm run dev
```
기본적으로 `http://localhost:4000` 에서 실행됩니다.

- `/member` : 회원가입(join), 로그인(login), 로그인확인(check), 목록(list), 상세(get/:id), 수정(update/:id), 삭제(delete/:id)
- `/board` : 작성(write), 목록(list), 상세(get/:id), 수정(update/:id), 삭제(delete/:id)

API 테스트는 `express/test.http` 파일을 참고하세요 (VS Code REST Client 확장 등에서 사용 가능).

### 3. 프론트엔드 (next_js/)
```bash
cd next_js
npm install
npm run dev
```
기본적으로 `http://localhost:3000` 에서 실행되며, `.env.local` 의 `NEXT_PUBLIC_API_URL` 로 백엔드 주소를 지정합니다.

## 주요 기능

- 회원가입 / 로그인 (비밀번호는 bcryptjs 로 해시 저장, 로그인 시 JWT 발급)
- 로그인한 사용자만 글쓰기 가능
- 작성자 본인만 게시글 수정/삭제 가능
- 게시글 목록 페이지네이션, 상세 조회 시 조회수 증가
