"use client";

import styles from "./navbar.module.css";
import { useUser } from "../context/UserContext";
import { SHOP_APP_URL, getImageUrl } from "../utils/url";

export default function Navbar() {
 
  const { user } = useUser();
  const displayName = user?.username || "Khách";
  const avatarUrl = user?.avatar_url || user?.avatar || "/default_avatar.png";

  return (
    <nav className={styles.navbar}>

      <div className={styles.logo}>
        <img src="/logo3.png" alt="HobbyJapan Logo" />
        <p>GunVerse</p>
      </div>

      <div className={styles.menu}>

        <a href="/social" className={styles.menuItem}>
          <img src="/icons/home.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>Trang chủ</span>
        </a>

        <a href={SHOP_APP_URL} className={styles.menuItem}>
          <img src="/icons/shop.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>GunBuys</span>
        </a>

        <a href="/profile" className={styles.menuItem}>
          <img src="/icons/profile.png" className={styles.menuIcon}/>
          <span className={styles.menuText}>Trang cá nhân</span>
        </a>

      </div>

      <div className={styles.user}>
        <img
          src={getImageUrl(avatarUrl) || "/default_avatar.png"}
          className={styles.avatar}
        />
        <span className={styles.username}>
          {displayName}
        </span>
      </div>

    </nav>
  );
}
// "use client";

// import styles from "./navbar.module.css";
// import { useEffect, useState } from "react";
// import { getMe } from "../utils/auth";

// type User = {
//   name: string;
//   avatar: string;
// };

// export default function Navbar({ user }: { user: User }) {
//   return (
//     <nav className={styles.navbar}>

//       <div className={styles.logo}>
//         <img src="/logo3.png" alt="HobbyJapan Logo" />
//         <p>GunVerse</p>
//       </div>

//       <div className={styles.menu}>

//         <a href="/social" className={styles.menuItem}>
//           <img src="/icons/home.png" className={styles.menuIcon}/>
//           <span className={styles.menuText}>Trang chủ</span>
//         </a>

//         <a href="#" className={styles.menuItem}>
//           <img src="/icons/shop.png" className={styles.menuIcon}/>
//           <span className={styles.menuText}>Mua hàng</span>
//         </a>

//         <a href="/profile" className={styles.menuItem}>
//           <img src="/icons/profile.png" className={styles.menuIcon}/>
//           <span className={styles.menuText}>Trang cá nhân</span>
//         </a>

//       </div>

//       <div className={styles.user}>
//         <img src={user.avatar} className={styles.avatar}/>
//         <span className={styles.username}>{user.name}</span>
//       </div>

//     </nav>
//   );
// }