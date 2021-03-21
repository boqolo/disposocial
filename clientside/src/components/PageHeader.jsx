import React from "react";

export default function Header() {

  return (
    <>
      <nav
        data-role="appbar" 
        data-expand-point="sm">
        <a class="brand no-hover" href="/">Disposocial</a>
        <ul class="app-bar-menu">
          <li><a href="/discover">Discover</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/login">Log In</a></li>
          <li><a href="/register">Create Account</a></li>
        </ul>
      </nav>
      <div class="p-6"></div>
    </>
  );

}
