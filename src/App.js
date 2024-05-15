import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import PreviewImage from './PreviewImage';

function App() {
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const formik = useFormik({
        initialValues: {
            image: null // Initialize with null
        },
        validationSchema: Yup.object({
            image: Yup.mixed().required("Required.!")
                .test("FILE_SIZE", "Too big.!", (value) => value && value.size < 1024 * 1024)
                .test("FILE_TYPE", "Invalid file type.!", (value) => value && ['image/png', 'image/jpeg'].includes(value.type))
        }),

        onSubmit: async () => {
            const { image } = formik.values;
            const formData = new FormData();

            try {
                formData.append("file", image);
                formData.append("upload_preset", "xl8lkm3i");
                const res = await axios.post("https://api.cloudinary.com/v1_1/dh2vjivem/image/upload", formData);

                if (res.data && res.data.secure_url) {
                    // Store the uploaded image URL in state
                    setUploadedImageUrl(res.data.secure_url);
                    console.log("Uploaded image URL:", res.data.secure_url);
                } else {
                    console.error("Unable to retrieve secure URL from Cloudinary response.");
                }
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
            }
        }
    });

    return (
        <div className='App'>
            <form onSubmit={formik.handleSubmit}>
                <input type='file' name='image' onChange={(e) => formik.setFieldValue("image", e.target.files[0])} />

                {formik.errors.image && (
                    <p style={{ color: 'red' }}>{formik.errors.image}</p>
                )}

                <button type='Submit'>Upload</button>
            </form>

             {/* Optionally, pass the uploaded image file to PreviewImage component */}
             {formik.values.image && <PreviewImage file={formik.values.image} />}

            {/* Display the uploaded image using the URL stored in state */}
            {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: "50%" }} />}
            
           
        </div>
    );
}

export default App;
