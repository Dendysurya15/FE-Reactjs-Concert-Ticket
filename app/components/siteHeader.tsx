export default function SiteHeader() {
  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0">
      <h1 className="text-2xl font-bold">Concert Ticket Booking</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/login" className="hover:underline">
              Login
            </a>
          </li>
          <li>
            <a href="/register" className="hover:underline">
              Register
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
