"use client";

import styles from "./userprofile.module.css";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { getFollowers, getFollowing, getUserById } from "@/app/utils/api";
import { useParams } from "next/navigation";
import PostCard from "@/app/components/post/PostCard";
import PostDetailModal from "@/app/components/post/PostDetailModal";

interface FollowUser {
    id: number;
    name: string;
    avatar: string;
}

interface Post {
    id: number;
    caption: string;
    images: {
        image_url: string;
        public_url: string;
        is_thumbnail: boolean;
    }[];
    like_count: number;
    comment_count: number;
    share_count: number;
    comments: {
        id: number;
        user: {
            username: string;
            avatar: string;
        };
        content: string;
    }[];
    user_id: number;
    status: "active" | "hidden";
}

interface User {
    id: number;
    username: string;
    avatar: string;
    followers: FollowUser[];
    following: FollowUser[];
    posts?: Post[];
}

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);

    const [openModal, setOpenModal] = useState<"followers" | "following" | null>(null);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // fetch user khác
    useEffect(() => {
        if (!userId) return;
        const fetchUser = async () => {
            const data = await getUserById(userId);
            setUser(data?.data || data);
        };

        if (userId) fetchUser();
    }, [userId]);

    console.log("userId:", userId);
    console.log("user:", user);


    if (!user) return <div>Đang tải...</div>;
    if (!userId) return <div>Thiếu userId</div>;
    if (!userId) return <div>Thiếu userId</div>;

    if (!user) {
        return (
            <div style={{ color: "white", padding: 20 }}>
                Đang tải user...
            </div>
        );
    }
    return (
        <>
            <Navbar />

            <div className={styles.container}>
                {/* TOP */}
                <div className={styles.topSection}>

                    {/* Avatar */}
                    <div className={styles.avatarSection}>
                        <img
                            src={user.avatar || "/default_avatar.png"}
                            className={styles.avatar}
                        />
                    </div>

                    {/* Info */}
                    <div className={styles.infoSection}>

                        <h2 className={styles.name}>{user.username}</h2>

                        {/* ACTION */}
                        <div className={styles.actionRow}>
                            <button className={styles.postBtn}>
                                <img src="/icons/plus.png" className={styles.icon} />
                                Follow
                            </button>
                        </div>

                        {/* FOLLOW */}
                        <div className={styles.followRow}>
                            <span
                                onClick={async () => {
                                    setOpenModal("followers");
                                    setLoadingFollow(true);

                                    const res = await getFollowers(user.id);
                                    setFollowers(res.data || res);

                                    setLoadingFollow(false);
                                }}
                                className={styles.clickable}
                            >
                                <strong>{followers.length}</strong> Followers
                            </span>

                            <span
                                onClick={async () => {
                                    setOpenModal("following");
                                    setLoadingFollow(true);

                                    const res = await getFollowing(user.id);
                                    setFollowing(res.data || res);

                                    setLoadingFollow(false);
                                }}
                                className={styles.clickable}
                            >
                                <strong>{following.length}</strong> Following
                            </span>
                        </div>
                    </div>
                </div>

                {/* POSTS */}
                <div className={styles.postSection}>
                    <h3>Bài viết</h3>

                    <div className={styles.postGrid}>
                        {user.posts && user.posts.length > 0 ? (
                            user.posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => setSelectedPost(post)}
                                />
                            ))
                        ) : (
                            <p className={styles.noPost}>Chưa có bài viết</p>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL FOLLOW */}
            {openModal && (
                <div className={styles.modalOverlay} onClick={() => setOpenModal(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{openModal === "followers" ? "Followers" : "Following"}</h3>

                        <div className={styles.userList}>
                            {loadingFollow ? (
                                <p>Đang tải...</p>
                            ) : (openModal === "followers" ? followers : following).length > 0 ? (
                                (openModal === "followers" ? followers : following).map((u) => (
                                    <div key={u.id} className={styles.userItem}>
                                        <img
                                            src={u.avatar || "/default_avatar.png"}
                                            className={styles.smallAvatar}
                                        />
                                        <span>{u.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    currentUserId={user.id}
                    currentUserAvatar={user.avatar}
                    currentUsername={user.username}
                    onClose={() => setSelectedPost(null)}
                />
            )} */}
        </>
    );
}