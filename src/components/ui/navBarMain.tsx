import React from 'react'

export default function NavBarMain() {
  return (
    <nav>
        <ul className="flex gap-4">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="/login">Contact</a>
          </li>
        </ul>
  
    </nav>
  )
}
