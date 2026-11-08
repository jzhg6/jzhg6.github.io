import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page content-shell">
      <p className="not-found-code">404</p>
      <h1>这一页还没有被写下。</h1>
      <p>链接可能已经改变，或者这篇记录仍留在草稿里。</p>
      <Link className="primary-link" href="/posts"><ArrowLeft aria-hidden="true" />返回文章归档</Link>
    </main>
  );
}
