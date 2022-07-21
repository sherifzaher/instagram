import {useState, forwardRef} from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import instance from "./axios";
import {format} from'timeago.js'

const Post = forwardRef(
    ({ user, username, postId, imageUrl, caption,commentx }, ref) => {
        const [comment, setComment] = useState("");
        const postComment = async (e) => {
            e.preventDefault();
            const res = await instance.post(`/comments/${postId}`,{
                user:user.email,
                text:comment,
                date:new Date().getTime()
            });
            setComment("");
        };

        return (
            <div className="post" ref={ref}>
                <div className="post__header">
                    <Avatar
                        className="post__avatar"
                        alt={username}
                        src="/static/images/avatar/1.jpg"
                    />
                    <h3>{username}</h3>
                </div>

                <img className="post__image" src={imageUrl} alt="post" />
                <h4 className="post__text">
                    {username} <span className="post__caption">{caption}</span>
                </h4>

                <div className="post__comments">
                    {commentx.map((comment) => (
                            <div style={{
                                display:"flex",
                                justifyContent:"space-between",
                                margin:"5px 0"
                            }}>
                                <div style={{
                                    display:"flex",
                                    alignItems:"center"
                                }}>
                                    <h1 style={{fontSize:"14px",fontWeight:"600"}}>{comment.user} : </h1>
                                    <p style={{paddingLeft:"10px",fontSize:"small"}}>{comment.text}</p>
                                </div>
                                <p style={{fontSize:"12px",fontWeight:"500"}}>{format(comment.date)}</p>
                            </div>
                    ))}
                </div>

                {user && (
                    <form className="post__commentBox">
                        <input
                            className="post__input"
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            disabled={!comment}
                            className="post__button"
                            type="submit"
                            onClick={postComment}
                        >
                            Post
                        </button>
                    </form>
                )}
            </div>
        );
    }
);

export default Post;
