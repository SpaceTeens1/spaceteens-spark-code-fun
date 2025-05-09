
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Check, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  bucketName: string;
  folderPath?: string;
  onFileUploaded: (url: string, fileName: string, fileType: string) => void;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

const EnhancedFileUploader = ({
  bucketName,
  folderPath = '',
  onFileUploaded,
  acceptedFileTypes = '*',
  maxSizeInMB = 50
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeInMB}MB`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Determine file type category
      const fileType = getFileType(selectedFile.type);
      
      // Set up a progress tracker
      let lastProgressUpdate = 0;
      const progressInterval = setInterval(() => {
        lastProgressUpdate += 10;
        if (lastProgressUpdate <= 90) {
          setUploadProgress(lastProgressUpdate);
        }
      }, 300);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
        
      clearInterval(progressInterval);
      
      if (uploadError) {
        throw uploadError;
      }
      
      setUploadProgress(100);
      
      // Get the public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully"
      });
      
      onFileUploaded(data.publicUrl, fileName, fileType);
      setSelectedFile(null);
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'other';
  };
  
  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    const type = getFileType(selectedFile.type);
    return <File className="h-8 w-8 text-blue-500 mr-2" />;
  };
  
  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${selectedFile ? 'bg-gray-50' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-600">Drag and drop a file here, or click to select</p>
            <p className="text-xs text-gray-400">Maximum file size: {maxSizeInMB}MB</p>
            <Input
              type="file"
              accept={acceptedFileTypes}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getFileIcon()}
              <div className="text-left">
                <p className="font-medium text-gray-800 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-gray-500 text-center">{uploadProgress}% Uploaded</p>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button onClick={handleUpload} className="bg-spaceteens-blue">
                Upload File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUploader;
