export default function Header() {
    return (
        <header >
            <nav>
            {/* bg-indigo-400 */}
                <ul className="flex flex-row items-center pt-8 pr-8 pl-8">
                    <li><a className="pr-4" href="/">Home</a></li>
                    <li><a className="pr-4" href="/add-new">Add New</a></li>
                    <li><a className="pr-4" href="/edit">Edit</a></li>
                </ul>
            </nav>
        </header>
    )
}