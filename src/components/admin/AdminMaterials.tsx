
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Video, File, Image, FilePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EnhancedFileUploader from './EnhancedFileUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lesson {
  id: string;
  title: string;
}

interface Material {
  id: string;
  lesson_id: string;
  title: string;
  type: string;
  url: string;
}

const AdminMaterials = () => {
  const { toast } = useToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newMaterial, setNewMaterial] = useState({
    lessonId: '',
    title: '',
    type: 'pdf',
    url: ''
  });
  
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  
  // Fetch lessons and materials data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, title')
          .order('title');
          
        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
        
        // Fetch materials
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);
        
      } catch (error: any) {
        toast({
          title: 'Error fetching data',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddMaterial = async () => {
    if (!newMaterial.lessonId || !newMaterial.title || !newMaterial.url) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert({
          lesson_id: newMaterial.lessonId,
          title: newMaterial.title,
          type: newMaterial.type,
          url: newMaterial.url
        })
        .select();
        
      if (error) throw error;
      
      setMaterials([...(data || []), ...materials]);
      setNewMaterial({
        lessonId: '',
        title: '',
        type: 'pdf',
        url: ''
      });
      setShowUploader(false);
      
      toast({
        title: "Material added",
        description: `${newMaterial.title} has been added successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error adding material",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return;
    
    try {
      const { error } = await supabase
        .from('materials')
        .update({
          lesson_id: editingMaterial.lesson_id,
          title: editingMaterial.title,
          type: editingMaterial.type,
          url: editingMaterial.url
        })
        .eq('id', editingMaterial.id);
        
      if (error) throw error;
      
      setMaterials(materials.map(material => 
        material.id === editingMaterial.id ? editingMaterial : material
      ));
      setEditingMaterial(null);
      
      toast({
        title: "Material updated",
        description: `${editingMaterial.title} has been updated successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error updating material",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMaterials(materials.filter(material => material.id !== id));
      
      toast({
        title: "Material deleted",
        description: "The material has been deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error deleting material",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleFileUploaded = (url: string, fileName: string, fileType: string) => {
    setNewMaterial({
      ...newMaterial,
      url,
      type: fileType
    });
  };
  
  const getLessonTitle = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'video':
        return <Video className="text-blue-500" />;
      case 'image':
        return <Image className="text-green-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">Course Materials</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingMaterial ? 'Edit Learning Material' : 'Add Learning Material'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="lessonId" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson
            </label>
            <Select
              value={editingMaterial ? editingMaterial.lesson_id : newMaterial.lessonId}
              onValueChange={(value) => editingMaterial 
                ? setEditingMaterial({...editingMaterial, lesson_id: value})
                : setNewMaterial({...newMaterial, lessonId: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map(lesson => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Material Title
            </label>
            <Input
              id="title"
              value={editingMaterial ? editingMaterial.title : newMaterial.title}
              onChange={(e) => editingMaterial 
                ? setEditingMaterial({...editingMaterial, title: e.target.value})
                : setNewMaterial({...newMaterial, title: e.target.value})
              }
              placeholder="Enter material title"
            />
          </div>
          
          {!editingMaterial && (
            <div>
              {showUploader ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Upload File</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowUploader(false)}
                    >
                      Enter URL Instead
                    </Button>
                  </div>
                  <EnhancedFileUploader
                    bucketName="course-materials"
                    folderPath="materials"
                    onFileUploaded={handleFileUploaded}
                    acceptedFileTypes="*"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      URL / Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        value={newMaterial.url}
                        onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                        placeholder="Enter file URL or link"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => setShowUploader(true)}
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        Upload New
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Material Type
                    </label>
                    <Select
                      value={newMaterial.type}
                      onValueChange={(value) => setNewMaterial({...newMaterial, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {editingMaterial && (
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL / Link
              </label>
              <Input
                id="url"
                value={editingMaterial.url}
                onChange={(e) => setEditingMaterial({...editingMaterial, url: e.target.value})}
                placeholder="Enter file URL or link"
              />
            </div>
          )}
          
          {editingMaterial && (
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Material Type
              </label>
              <Select
                value={editingMaterial.type}
                onValueChange={(value) => setEditingMaterial({...editingMaterial, type: value as 'pdf' | 'video' | 'image' | 'other'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            {editingMaterial && (
              <Button 
                variant="ghost" 
                onClick={() => setEditingMaterial(null)}
              >
                Cancel
              </Button>
            )}
            
            <Button
              onClick={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
              className="bg-spaceteens-blue hover:bg-blue-700"
            >
              {editingMaterial ? 'Update Material' : 'Add Material'}
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading materials...</TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">No materials found. Add your first material above.</TableCell>
              </TableRow>
            ) : (
              materials.map(material => (
                <TableRow key={material.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(material.type)}
                      <span>{material.type.toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{material.title}</TableCell>
                  <TableCell>{getLessonTitle(material.lesson_id)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {material.url}
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMaterial(material)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMaterials;
