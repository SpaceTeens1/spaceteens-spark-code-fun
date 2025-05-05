
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Video, File } from 'lucide-react';

interface Material {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'video' | 'other';
  url: string;
}

const AdminMaterials = () => {
  const { toast } = useToast();
  
  // Mock lessons for dropdown
  const lessons = [
    { id: '1', title: 'Introduction to Robots' },
    { id: '2', title: 'Building Your First Robot' },
    { id: '3', title: 'Coding Fundamentals' },
  ];
  
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      lessonId: '1',
      title: 'Robotics Basics PDF',
      type: 'pdf',
      url: 'https://example.com/robotics-basics.pdf'
    },
    {
      id: '2',
      lessonId: '1',
      title: 'Introduction Video',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example'
    }
  ]);
  
  const [newMaterial, setNewMaterial] = useState({
    lessonId: '',
    title: '',
    type: 'pdf',
    url: ''
  });
  
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  
  const handleAddMaterial = () => {
    if (!newMaterial.lessonId || !newMaterial.title || !newMaterial.url) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const material = {
      id: Date.now().toString(),
      lessonId: newMaterial.lessonId,
      title: newMaterial.title,
      type: newMaterial.type as 'pdf' | 'video' | 'other',
      url: newMaterial.url
    };
    
    setMaterials([...materials, material]);
    setNewMaterial({
      lessonId: '',
      title: '',
      type: 'pdf',
      url: ''
    });
    
    toast({
      title: "Material added",
      description: `${material.title} has been added successfully`
    });
  };
  
  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;
    
    const updatedMaterials = materials.map(material => 
      material.id === editingMaterial.id ? editingMaterial : material
    );
    
    setMaterials(updatedMaterials);
    setEditingMaterial(null);
    
    toast({
      title: "Material updated",
      description: `${editingMaterial.title} has been updated successfully`
    });
  };
  
  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
    
    toast({
      title: "Material deleted",
      description: "The material has been deleted successfully"
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
            <select
              id="lessonId"
              value={editingMaterial ? editingMaterial.lessonId : newMaterial.lessonId}
              onChange={(e) => editingMaterial 
                ? setEditingMaterial({...editingMaterial, lessonId: e.target.value})
                : setNewMaterial({...newMaterial, lessonId: e.target.value})
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select a lesson</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
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
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Material Type
            </label>
            <select
              id="type"
              value={editingMaterial ? editingMaterial.type : newMaterial.type}
              onChange={(e) => editingMaterial 
                ? setEditingMaterial({...editingMaterial, type: e.target.value as 'pdf' | 'video' | 'other'})
                : setNewMaterial({...newMaterial, type: e.target.value as 'pdf' | 'video' | 'other'})
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="pdf">PDF Document</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL / Link
            </label>
            <Input
              id="url"
              value={editingMaterial ? editingMaterial.url : newMaterial.url}
              onChange={(e) => editingMaterial
                ? setEditingMaterial({...editingMaterial, url: e.target.value})
                : setNewMaterial({...newMaterial, url: e.target.value})
              }
              placeholder="Enter file URL or link"
            />
          </div>
          
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
            {materials.map(material => (
              <TableRow key={material.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(material.type)}
                    <span>{material.type.toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>{material.title}</TableCell>
                <TableCell>{getLessonTitle(material.lessonId)}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMaterials;
