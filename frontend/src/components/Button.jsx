export const Button = ({ onClick, label }) => {
    return <button
        onClick={onClick}
        className="w-full text-white bg-slate-800 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
        {label}
    </button>
}