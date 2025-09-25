// 1. FIXED ImageUpload Component (Admin Panel)
import { useState, useRef } from "react";
import { UploadCloud, X, AlertCircle } from "lucide-react";

const ImageUpload = ({ onUpload, existingImages = [] }) => {
    const [files, setFiles] = useState(
        existingImages.map((url) => ({ file: null, name: url, url }))
    );
    const fileInputRef = useRef(null);

    // FIXED: Use HTTPS to avoid mixed content issues
    const BACKEND_URL = "https://backend-production-5823.up.railway.app";

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        selectedFiles.forEach(file => {
            console.log('Selected file:', {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
            });
        });

        const fileObjects = selectedFiles.map((file) => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        const updatedFiles = [...files, ...fileObjects];
        setFiles(updatedFiles);

        if (onUpload) {
            const newFiles = updatedFiles.map((f) => f.file).filter(Boolean);
            console.log('Uploading files:', newFiles);
            onUpload(newFiles);
        }
    };

    const handleRemoveFile = (fileName) => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);

        if (onUpload) {
            onUpload(updatedFiles.map((f) => f.file).filter(Boolean));
        }
    };

    // ENHANCED: Better image URL construction with error handling
    const getImageUrl = (file) => {
        try {
            // For new uploads (blob URLs)
            if (file.url && file.url.startsWith("blob:")) {
                console.log('Using blob URL:', file.url);
                return file.url;
            }
            
            // For existing images from database
            if (file.url) {
                // Handle different possible formats:
                // - "/uploads/filename.jpg"
                // - "uploads/filename.jpg"  
                // - "filename.jpg"
                let imagePath = file.url;
                
                // Remove leading slash if present
                if (imagePath.startsWith('/')) {
                    imagePath = imagePath.substring(1);
                }
                
                // Ensure it starts with uploads/
                if (!imagePath.startsWith('uploads/')) {
                    imagePath = `uploads/${imagePath}`;
                }
                
                const fullUrl = `${BACKEND_URL}/${imagePath}`;
                console.log('Constructed image URL:', fullUrl);
                return fullUrl;
            }
            
            console.warn('No valid URL found for file:', file);
            return '';
        } catch (error) {
            console.error('Error constructing image URL:', error);
            return '';
        }
    };

    return (
        <div>
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current.click()}
            >
                <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                    Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    All image formats supported (PNG, JPG, GIF, WEBP) up to 50MB
                </p>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.svg,.avif,.heic,.heif,.ico,.jfif"
                />
            </div>

            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file, index) => {
                        const imageUrl = getImageUrl(file);
                        return (
                            <div key={index} className="relative group">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={file.name}
                                        className="w-full h-24 object-cover rounded-lg border"
                                        onError={(e) => {
                                            console.error('Image load error for URL:', imageUrl);
                                            console.error('File object:', file);
                                            // Replace with error placeholder
                                            e.target.outerHTML = `
                                                <div class="w-full h-24 bg-gray-200 rounded-lg border flex items-center justify-center">
                                                    <div class="text-center text-gray-500">
                                                        <div class="text-red-500 mb-1">⚠️</div>
                                                        <div class="text-xs">Image not found</div>
                                                    </div>
                                                </div>
                                            `;
                                        }}
                                        onLoad={() => {
                                            console.log('✅ Image loaded successfully:', imageUrl);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-24 bg-gray-200 rounded-lg border flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <AlertCircle className="w-6 h-6 mx-auto mb-1 text-red-500" />
                                            <div className="text-xs">No URL</div>
                                        </div>
                                    </div>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(file.name)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                                
                                {/* Enhanced debug info */}
                                {process.env.NODE_ENV === 'development' && (
                                    <div className="text-xs text-gray-500 mt-1 p-1 bg-white rounded border">
                                        <div>File: {file.name}</div>
                                        <div>Type: {file.file?.type || 'existing'}</div>
                                        <div>URL: {imageUrl || 'No URL'}</div>
                                        <div className="text-red-500">Raw: {file.url}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// 2. FIXED Frontend Image Component
const Image = ({ imgSrc, className, alt }) => {
    const BACKEND_URL = "https://backend-production-5823.up.railway.app";
    
    const getImageUrl = (src) => {
        if (!src) {
            console.warn('No image source provided');
            return '';
        }
        
        // If it's already a full URL, use as-is
        if (src.startsWith('http')) {
            return src;
        }
        
        // If it's a blob URL, use as-is
        if (src.startsWith('blob:')) {
            return src;
        }
        
        // For relative paths from database
        let imagePath = src;
        
        // Remove leading slash if present
        if (imagePath.startsWith('/')) {
            imagePath = imagePath.substring(1);
        }
        
        // Ensure it starts with uploads/
        if (!imagePath.startsWith('uploads/')) {
            imagePath = `uploads/${imagePath}`;
        }
        
        const fullUrl = `${BACKEND_URL}/${imagePath}`;
        console.log('Frontend image URL:', fullUrl);
        return fullUrl;
    };

    const imageUrl = getImageUrl(imgSrc);

    if (!imageUrl) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                <div className="text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">No Image</div>
                </div>
            </div>
        );
    }

    return (
        <img 
            className={className} 
            src={imageUrl} 
            alt={alt || "Image"} 
            onError={(e) => {
                console.error('Frontend image load failed for URL:', imageUrl);
                e.target.outerHTML = `
                    <div class="${className} bg-gray-200 flex items-center justify-center">
                        <div class="text-center text-gray-500">
                            <div class="text-red-500 mb-2">⚠️</div>
                            <div class="text-sm">Image not found</div>
                        </div>
                    </div>
                `;
            }}
            onLoad={() => {
                console.log('✅ Frontend image loaded:', imageUrl);
            }}
        />
    );
};

// 3. BACKEND SERVER.JS ADDITIONS - Add these to your server.js

/*
// Add BEFORE your existing routes
app.use("/uploads", (req, res, next) => {
    console.log('Serving static file:', req.path);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    next();
});

// Your existing static file serving
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Add a test endpoint to verify file serving
app.get('/test-image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    console.log('Testing image at:', filepath);
    
    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ error: 'Image not found', path: filepath });
    }
});
*/

export { ImageUpload, Image };