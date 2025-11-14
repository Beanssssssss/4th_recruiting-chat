import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-purple-500 text-white shadow-md fixed top-0 left-0 z-50">
      {/* 로고 영역 */}
      <div className="text-xl font-semibold tracking-tight">
        <Link href="/" className="hover:text-purple-200 transition-colors">
          Recruiting Bot
        </Link>
      </div>

      {/* 메뉴 링크 */}
      <div className="flex gap-5 text-lg">
        <Link
          href="/"
          className="hover:text-purple-200 transition-colors duration-200"
        >
          홈
        </Link>
        <Link
          href="/chat"
          className="hover:text-purple-200 transition-colors duration-200"
        >
          챗봇
        </Link>
        <Link
          href="/board"
          className="hover:text-purple-200 transition-colors duration-200"
        >
          게시판
        </Link>
        <Link
          href="/mostqna"
          className="hover:text-purple-200 transition-colors duration-200"
        >
          자주 묻는 질문
        </Link>
      </div>
    </nav>
  );
}