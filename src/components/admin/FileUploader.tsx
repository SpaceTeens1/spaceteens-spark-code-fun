
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  bucketName: string;
  folderPath?: string;
  onFileUploaded: (url: string, fileName: string) => void;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

const FileUploader = ({
  bucketName,
  folderPath = '',
  onFileUploaded,
  acceptedFileTypes = '*',
  maxSizeInMB = 10
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

    setIsUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully"
      });
      
      onFileUploaded(data.publicUrl, fileName);
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        disabled={isUploading}
        className="max-w-xs"
      />
      {isUploading && (
        <div className="flex items-center">
          <Upload className="animate-bounce mr-2" size={16} />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
