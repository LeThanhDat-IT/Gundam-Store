"use client";

import styles from "./social.module.css";
import Logo from "../components/logo";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/url";
import { loadLocalPosts } from "../utils/localPosts";

  const user = {
    name: "Xuân Trường",
    avatar: "/test/avt1.png"
  };

const posts = [
    {
        id: 1,
        user: "GundamFan",
        avatar: "/test/avt1.png",
        image: "/test/post1.jpg",
        caption: "Vừa hoàn thành MG Freedom Gundam 🔥",
        likes: 120,
        comments: 18,
        shares: 1
    },
    {
        id: 2,
        user: "FigureCollector",
        avatar: "/test/avt2.jpg",
        image: "/test/post2.jpg",
        caption: "Bộ sưu tập mới của tôi hôm nay!",
        likes: 89,
        comments: 10,
        shares: 1
    }
];

export default function SocialPage() {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [privacyMenu, setPrivacyMenu] = useState<number | null>(null);
    const [demoPosts, setDemoPosts] = useState(posts);

    useEffect(() => {
        const syncPosts = () => {
            const savedPosts = loadLocalPosts();
            const mappedPosts = savedPosts.map((post) => ({
                id: post.id,
                user: post.username,
                avatar: post.avatar,
                image: post.image,
                caption: post.caption,
                likes: post.likes,
                comments: post.comments,
                shares: post.shares,
            }));

            setDemoPosts([...mappedPosts, ...posts]);
        };

        syncPosts();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "gunverse_posts") {
                syncPosts();
            }
        };

        window.addEventListener("storage", handleStorage);

        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const toggleMenu = (postId: number) => {
    setActiveMenu(activeMenu === postId ? null : postId);
    setPrivacyMenu(null);
    };

    const togglePrivacyMenu = (postId: number) => {
    setPrivacyMenu(privacyMenu === postId ? null : postId);
    };


    const handleEdit = (postId: number) => {
        console.log("Edit post:", postId);
        // TODO: gọi API chỉnh sửa
    };

    const handleDelete = async (postId: number) => {
        console.log("Delete post:", postId);

        // TODO: API
        // await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    };

    const handlePrivacyChange = async (postId: number, type: string) => {
    console.log("Privacy change:", postId, type);

    // ví dụ API
    /*
    await fetch(`/api/posts/${postId}/privacy`,{
        method:"POST",
        body: JSON.stringify({privacy:type})
    })
    */

    setPrivacyMenu(null);
    setActiveMenu(null);
    };

    const handleLike = async (postId: number) => {
        try {
            // TODO: thay API thật vào đây
            await fetch(`/api/posts/${postId}/like`, {
                method: "POST"
            });

            console.log("Liked post:", postId);
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    const handleComment = async (postId: number) => {
        try {
            // TODO: mở popup comment hoặc gọi API
            console.log("Comment post:", postId);

            await fetch(`/api/posts/${postId}/comment`, {
                method: "POST"
            });

        } catch (error) {
            console.error("Comment error:", error);
        }
    };

    const handleShare = async (postId: number) => {
        try {
            await fetch(`/api/posts/${postId}/share`, {
                method: "POST"
            });

            console.log("Shared post:", postId);
        } catch (error) {
            console.error("Share error:", error);
        }
    };
    return (
        <div className={styles.container}>
            <Navbar/>
           
            <h1 className={styles.title}></h1>

            <div className={styles.feed}>
                {demoPosts.map((post) => (
                    <div key={post.id} className={styles.card}>

                        <div className={styles.header}>
                            <img src={getImageUrl(post.avatar)} className={styles.avatar} />
                            <span className={styles.username}>{post.user}</span>

                            <div className={styles.menuWrapper}>
                                <img
                                    src="/icons/menu.png"
                                    className={styles.moreIcon}
                                    onClick={() => toggleMenu(post.id)}
                                />

                                {activeMenu === post.id && (
                                    <div className={styles.menu}>

                                        <div 
                                            className={styles.menuItem}
                                            onClick={() => handleEdit(post.id)}
                                        >
                                            <img src="/icons/edit.png" className={styles.menuIcon} />
                                            Chỉnh sửa bài viết
                                        </div>

                                        <div 
                                            className={styles.menuItem}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <img src="/icons/trash.png" className={styles.menuIcon} />
                                            Xóa bài viết
                                        </div>

                                        <div
                                        className={styles.menuItem}
                                        onClick={() => togglePrivacyMenu(post.id)}
                                        >
                                            <img src="/icons/privacy.png" className={styles.menuIcon} />
                                            Quyền riêng tư
                                        </div>

                                        {privacyMenu === post.id && (
                                            <div className={styles.subMenu}>

                                                <div
                                                className={styles.menuItem}
                                                onClick={() => handlePrivacyChange(post.id,"public")}
                                                >
                                                <img src="/icons/global.png" className={styles.menuIcon} />
                                                Công khai
                                                </div>

                                                <div
                                                className={styles.menuItem}
                                                onClick={() => handlePrivacyChange(post.id,"private")}
                                                >
                                                <img src="/icons/private.png" className={styles.menuIcon} />
                                                Chỉ mình tôi
                                                </div>

                                            </div>
                                            )}

                                    </div>
                                )}
                            </div>
                        </div>

                        <img src={getImageUrl(post.image)} className={styles.postImage} />

                        <div className={styles.actions}>

                            <div 
                                className={styles.actionItem}  
                                onClick={() => handleLike(post.id)}
                            >
                                <img src="/icons/like.png" className={styles.icon} />
                                {post.likes > 0 && <span>{post.likes}</span>}
                            </div>

                            <div 
                                className={styles.actionItem}
                                onClick={() => handleComment(post.id)}
                            >
                                <img src="/icons/cmt.png" className={styles.icon} />
                                {post.comments > 0 && <span>{post.comments}</span>}
                            </div>

                            <div 
                                className={styles.actionItem}
                                onClick={() => handleShare(post.id)}
                            >
                                <img src="/icons/share.png" className={styles.icon} />
                                {post.shares > 0 && <span>{post.shares}</span>}
                            </div>

                        </div>

                        <div className={styles.meta}>
                            <p className={styles.caption}>
                                <b>{post.user}</b> {post.caption}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}