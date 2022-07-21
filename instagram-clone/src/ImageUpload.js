import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./ImageUpload.css";
import instance from "./axios";
import { Input, Button } from "@mui/material";

const ImageUpload = ({ username }) => {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files);
        }
    };

    const handleUpload = () => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${new Date().getTime()}${image[0].name}`);
        const uploadTask = uploadBytesResumable(storageRef, image[0]);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
            },
            async () => {
                 await getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL)=>{
                     try{
                         await instance.post('/upload',{
                             caption:caption,
                             user:username,
                             image:downloadURL
                         });
                         setCaption("");
                         setProgress(0);
                         setImage(null);
                     }catch (err){
                         console.log(err);
                     }
                 })
            }
        );
    };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <Input
                placeholder="Enter a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <div>
                <input type="file" onChange={handleChange} />
                <Button className="imageupload__button" onClick={handleUpload}>
                    Upload
                </Button>
            </div>

            <br />
        </div>
    );
};

export default ImageUpload;
