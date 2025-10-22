import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <a href="https://retalk.bot" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
                <span className="text-gray-600">Powered by</span>
                <div className="flex items-center gap-1.5">
                    <Image src="https://retalk.bot/_next/image?url=%2Fimages%2Flogo.webp&w=256&q=75" alt="Retalk Logo" width={20} height={20} className="rounded" />
                    <span className="font-semibold text-gray-800">Retalk</span>
                </div>
            </a>
        </footer>
    )
}
