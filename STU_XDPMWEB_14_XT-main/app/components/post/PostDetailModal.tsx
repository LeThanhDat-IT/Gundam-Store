"use client";

import styles from "./PostDetailModal.module.css";
import { useState, useEffect } from "react";
import { BASE_URL, getImageUrl } from "@/app/utils/url";
import { toast } from "react-toastify";

interface Comment {
    id: number;
    user: {
        username: string;
        avatar: string;
    };
    content: string;
}

interface Post {
    id: number;
    user_id: number;
    caption: string;

    images: {
        image_url: string;
        public_url: string;
        is_thumbnail: boolean;
    }[];

    like_count: number;
    comment_count: number;
    share_count: number;
    comments: Comment[];
    status: "active" | "hidden";
}

type Props = {
    post: Post;
    currentUserId: number;
    currentUserAvatar: string;
    currentUsername: string;
    onClose: () => void;
    onUpdatePost: (updatedPost: Post) => void;
    onDeletePost: (postId: number) => void;
};

export default function PostDetailModal({
    post,
    currentUserId,
    currentUserAvatar,
    currentUsername,
    onClose,
    onUpdatePost,
    onDeletePost,
}: Props) {
    const isOwner = post.user_id === currentUserId;
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [content, setContent] = useState(post.caption);
    const [images, setImages] = useState<File[]>([]);
    const [privacy, setPrivacy] = useState<"active" | "hidden">("active");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);

    useEffect(() => {
        setContent(post.caption);
        setPrivacy(post.status);
    }, [post]);

    const toggleMenu = (id: number) => {
        setActiveMenu(activeMenu === id ? null : id);
    };


    const handleEdit = () => {
        setContent(post.caption);
        setPrivacy(post.status);
        setImages([]);
        setOpenEditModal(true);
    };

    // const handleDelete = async () => {
    //     if (!postToDelete) return;

    //     try {
    //         const token = localStorage.getItem("token");

    //         const res = await fetch(
    //             `https://web-pgb0.onrender.com/posts/${postToDelete}`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     _method: "DELETE",
    //                 }),
    //             }
    //         );

    //         const data = await res.json();
    //         console.log("DELETE:", data);

    //         // cập nhật ui ở profile page
    //         onDeletePost(post.id);

    //         // đóng modal confirm
    //         setShowDeleteConfirm(false);

    //         // đóng modal chi tiết
    //         onClose();

    //         // reset state
    //         setPostToDelete(null);

    //     } catch (err) {
    //         console.error("Delete failed:", err);
    //     }
    // };

    const handleDelete = async () => {

        if (!postToDelete) return;

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const res = await toast.promise(

                fetch(
                    `${BASE_URL}/posts/${postToDelete}`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            _method: "DELETE"
                        })
                    }
                ),

                {
                    pending:
                        "Đang xóa bài viết...",

                    success:
                        "Xóa bài thành công",

                    error:
                        "Xóa bài thất bại"
                }

            );

            if (!res.ok) {
                throw new Error(
                    "Delete failed"
                );
            }

            const data =
                await res.json();

            console.log(
                "DELETE:",
                data
            );

            // cập nhật UI profile
            onDeletePost(
                post.id
            );

            // đóng modal confirm
            setShowDeleteConfirm(
                false
            );

            // đóng modal detail
            onClose();

            // reset
            setPostToDelete(
                null
            );

        } catch (err) {

            console.error(
                "Delete failed:",
                err
            );

        }

    };

    const handleUpdatePost = async () => {
        try {
            const formData = new FormData();

            formData.append("caption", content);
            formData.append("status", privacy);
            formData.append("_method", "PUT");

            images.forEach((img) => {
                formData.append("images[]", img);
            });

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/posts/${post.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            console.log("UPDATED:", data);

            setOpenEditModal(false);
            onUpdatePost(data.data || data);


            // ⚠️ nếu muốn update UI ngay → cần callback từ cha

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {!openEditModal && (
                <div className={styles.overlay} onClick={onClose}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* LEFT */}
                        <div className={styles.left}>
                            <img
                                src={getImageUrl(post.images?.[0]?.public_url)}
                            />
                        </div>

                        {/* RIGHT */}
                        <div className={styles.right}>
                            {/* user */}
                            <div className={styles.userRow}>
                                {/* <div className={styles.userInfo}>
                                    <img src={currentUserAvatar || "/default_avatar.png"} className={styles.avatar} />
                                    <span>{currentUsername}</span>
                                </div> */}

                                <div className={styles.userInfo}>
                                    <img
                                        src={getImageUrl(currentUserAvatar)}
                                        className={styles.avatar}
                                    />

                                    <div className={styles.userText}>
                                        <span className={styles.username}>{currentUsername}</span>

                                        {/* 🔥 Privacy hiển thị ở đây */}
                                        <div className={styles.privacyStatus}>
                                            <img
                                                src={
                                                    post.status === "active"
                                                        ? "/icons/global.png"
                                                        : "/icons/private.png"
                                                }
                                                className={styles.privacyIcon}
                                            />
                                            <span>
                                                {post.status === "active" ? "Công khai" : "Riêng tư"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 👇 chỉ hiện nếu là chủ bài viết */}
                                {isOwner && (
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
                                                    onClick={() => handleEdit()}                                        >
                                                    <img src="/icons/edit.png" className={styles.menuIcon} />
                                                    Chỉnh sửa bài viết
                                                </div>

                                                <div className={styles.lined}></div>

                                                <div
                                                    className={styles.menuItem}
                                                    // onClick={() => handleDelete(post.id)}
                                                    onClick={() => {
                                                        setPostToDelete(post.id);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <img src="/icons/trash.png" className={styles.menuIcon} />
                                                    Xóa bài viết
                                                </div>



                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* caption */}
                            <p className={styles.caption}>{post.caption}</p>

                            {/* stats */}
                            <div className={styles.stats}>
                                <span className={styles.statItem}>
                                    <img src="/icons/like.png" className={styles.icon} />
                                    {post.like_count}
                                </span>

                                <span className={styles.statItem}>
                                    <img src="/icons/cmt.png" className={styles.icon} />
                                    {post.comment_count}
                                </span>

                                <span className={styles.statItem}>
                                    <img src="/icons/share.png" className={styles.icon} />
                                    {post.share_count}
                                </span>
                            </div>


                            {/* comments */}
                            <div className={styles.comments}>
                                {post.comments?.map((c) => (
                                    <div key={c.id} className={styles.commentItem}>
                                        <img src={getImageUrl(c.user.avatar)} className={styles.avatarSmall} />
                                        <div>
                                            <span className={styles.username}>{c.user.username}</span>
                                            <p>{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {openEditModal && (
                <div
                    className={styles.modalOverlay2}
                    onClick={(e) => {
                        setOpenEditModal(false);
                    }}
                >
                    <div
                        className={styles.postModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Title */}
                        <h3 className={styles.modalTitle}>Chỉnh sửa bài viết</h3>

                        {/* User + Privacy */}
                        <div className={styles.postHeader}>
                            <img
                                src={currentUserAvatar || "/default_avatar.png"}
                                className={styles.smallAvatar}
                            />

                            <div
                                className={styles.privacyWrapper}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="privacy-edit"
                                        value="public"
                                        checked={privacy === "active"}
                                        onChange={() => setPrivacy("active")}
                                    />

                                    <div className={styles.radioContent}>
                                        <img src="/icons/global.png" className={styles.icon} />
                                        <span>Công khai</span>
                                    </div>
                                </label>

                                <label className={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="privacy-edit"
                                        value="private"
                                        checked={privacy === "hidden"}
                                        onChange={() => setPrivacy("hidden")}
                                    />

                                    <div className={styles.radioContent}>
                                        <img src="/icons/private.png" className={styles.icon} />
                                        <span>Riêng tư</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Content */}
                        <textarea
                            className={styles.textarea}
                            placeholder="Bạn đang nghĩ gì?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Upload ảnh */}
                        <label className={styles.uploadBtn}>
                            <img src="/icons/image.png" className={styles.icon} />
                            Chọn ảnh
                            <input
                                type="file"
                                multiple
                                className={styles.hiddenInput}
                                onChange={(e) =>
                                    setImages(Array.from(e.target.files || []))
                                }
                            />
                        </label>

                        {/* Preview */}
                        <div className={styles.preview}>

                            {post.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={getImageUrl(img.public_url)}
                                    className={styles.previewImg}
                                />
                            ))}

                            {/* ảnh mới */}
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    className={styles.previewImg}
                                />
                            ))}
                        </div>

                        <div className={styles.line}></div>

                        {/* Button */}
                        <button
                            className={styles.submitBtn}
                            onClick={handleUpdatePost}
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <p>Bạn có chắc muốn xóa bài viết?</p>

                        <div className={styles.confirmActions}>
                            <button onClick={() => setShowDeleteConfirm(false)}>
                                Hủy
                            </button>

                            <button
                                className={styles.deleteBtn}
                                onClick={handleDelete}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}