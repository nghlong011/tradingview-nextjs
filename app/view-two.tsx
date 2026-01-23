// Component cho View 2 - hiển thị khi điều kiện không được thỏa mãn
export default function ViewTwo() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
            {/* Header */}
            <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <a href="/" className="flex items-center gap-2 group">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/40">
                            <span className="text-xs font-black tracking-tight">TV</span>
                        </span>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold tracking-tight group-hover:text-sky-400 transition">
                                Tech Insight
                            </span>
                            <span className="text-[11px] text-slate-400">Blog công nghệ & tài chính số</span>
                        </div>
                    </a>
                    <nav className="hidden sm:flex items-center gap-6 text-sm">
                        <a href="/" className="text-slate-300 hover:text-white transition">
                            Trang chủ
                        </a>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/40">
                            Blog công nghệ
                        </span>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1">
                <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center">
                        <div>
                            <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 mb-4">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/40 text-[10px]">
                                    AI
                                </span>
                                Xu hướng mới trong giao dịch & dữ liệu thời gian thực
                            </p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
                                Blog công nghệ cho nhà giao dịch
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300/90 max-w-xl mb-6">
                                Góc nhìn sâu về AI, dữ liệu thời gian thực, algorithmic trading và những công nghệ đứng sau các nền tảng phân tích như TradingView.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <a
                                    href="#articles"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/40 transition"
                                >
                                    Khám phá bài viết
                                    <span className="text-base">↘</span>
                                </a>
                                <span className="text-xs sm:text-sm text-slate-400">
                                    Cập nhật mỗi tuần • Nội dung chọn lọc cho developer & trader
                                </span>
                            </div>
                            <dl className="grid grid-cols-3 gap-4 max-w-md text-xs sm:text-sm">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                                    <dt className="text-slate-400 mb-0.5">Chủ đề</dt>
                                    <dd className="font-semibold text-slate-100">AI, Trading, Realtime</dd>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                                    <dt className="text-slate-400 mb-0.5">Độc giả chính</dt>
                                    <dd className="font-semibold text-slate-100">Developer & Trader</dd>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                                    <dt className="text-slate-400 mb-0.5">Độ khó</dt>
                                    <dd className="font-semibold text-emerald-300">Trung cấp+</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-purple-500/5 blur-3xl opacity-70 pointer-events-none" />
                            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur p-4 shadow-2xl shadow-slate-950/80">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-slate-300">Stack công nghệ nổi bật</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-2 py-0.5 text-[11px] text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Live & cập nhật
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">
                                            Realtime data
                                        </p>
                                        <p className="font-semibold text-slate-100 mb-1">WebSocket & Streaming</p>
                                        <p className="text-[11px] text-slate-400">
                                            Xây dựng pipeline dữ liệu giá chạy mượt trên browser.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">
                                            AI & Automation
                                        </p>
                                        <p className="font-semibold text-slate-100 mb-1">Signal & Bot trading</p>
                                        <p className="text-[11px] text-slate-400">
                                            Từ backtest đến triển khai bot ngoại hối & crypto.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Frontend</p>
                                        <p className="font-semibold text-slate-100 mb-1">UI/UX cho charting</p>
                                        <p className="text-[11px] text-slate-400">
                                            Tối ưu trải nghiệm xem chart nhiều khung thời gian.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1.5">Backend</p>
                                        <p className="font-semibold text-slate-100 mb-1">Laravel & microservices</p>
                                        <p className="text-[11px] text-slate-400">
                                            Thiết kế hệ thống scale tốt với traffic giao dịch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles list */}
                <section id="articles" className="bg-slate-950">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-1">
                                    Bài viết nổi bật
                                </h2>
                                <p className="text-sm text-slate-400 max-w-xl">
                                    Một số topic gợi ý để bạn bắt đầu. Sau này bạn có thể thay nội dung tĩnh này bằng dữ liệu thật từ database.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Nội dung demo • Dễ dàng tùy biến
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Card 1 */}
                            <article className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-sky-500/60 hover:bg-slate-900/80 transition overflow-hidden flex flex-col">
                                <div className="h-32 bg-gradient-to-tr from-sky-500/40 via-indigo-500/20 to-slate-900" />
                                <div className="flex-1 p-4 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-300 border border-sky-500/30">
                                            Realtime & Scaling
                                        </span>
                                        <span className="text-[11px] text-slate-400">~ 8 phút đọc</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-50 mb-1.5 group-hover:text-sky-300 transition">
                                        Kiến trúc dữ liệu thời gian thực cho nền tảng kiểu TradingView
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-3 flex-1">
                                        Phân tích cách thiết kế stream giá, ôm nhiều cặp tiền / mã cổ phiếu nhưng vẫn giữ UI mượt mà.
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>WebSocket • Cache • Queue</span>
                                        <span>Coming soon</span>
                                    </div>
                                </div>
                            </article>

                            {/* Card 2 */}
                            <article className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/60 hover:bg-slate-900/80 transition overflow-hidden flex flex-col">
                                <div className="h-32 bg-gradient-to-tr from-emerald-500/40 via-teal-500/20 to-slate-900" />
                                <div className="flex-1 p-4 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/30">
                                            AI & Bot
                                        </span>
                                        <span className="text-[11px] text-slate-400">~ 10 phút đọc</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-50 mb-1.5 group-hover:text-emerald-300 transition">
                                        Từ indicator đến bot trading: workflow hiện đại cho developer
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-3 flex-1">
                                        Cách kết hợp Python, Pine Script, API broker và AI để thiết kế hệ thống trading có thể backtest rõ ràng.
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>Backtest • Risk • Deployment</span>
                                        <span>Coming soon</span>
                                    </div>
                                </div>
                            </article>

                            {/* Card 3 */}
                            <article className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/60 hover:bg-slate-900/80 transition overflow-hidden flex flex-col">
                                <div className="h-32 bg-gradient-to-tr from-purple-500/40 via-fuchsia-500/20 to-slate-900" />
                                <div className="flex-1 p-4 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] text-purple-300 border border-purple-500/30">
                                            UI/UX
                                        </span>
                                        <span className="text-[11px] text-slate-400">~ 6 phút đọc</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-50 mb-1.5 group-hover:text-purple-300 transition">
                                        Thiết kế dashboard phân tích kỹ thuật nhìn sướng & dùng sướng
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-3 flex-1">
                                        Các pattern UI cho watchlist, multi-chart layout, dark mode và tối ưu performance frontend.
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>Tailwind • UX pattern</span>
                                        <span>Coming soon</span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/90">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
                    <p>© {new Date().getFullYear()} Tech Insight Blog. Một góc nhỏ cho những người yêu công nghệ & thị trường.</p>
                    <p>
                        Được xây dựng với
                        <span className="text-sky-400 font-medium"> Next.js</span> &<span className="text-sky-400 font-medium"> Tailwind CSS</span>.
                    </p>
                </div>
            </footer>
        </div>
    );
}
