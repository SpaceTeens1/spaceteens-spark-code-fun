
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Mock course type
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const AdminCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Robotics for Kids',
      description: 'Introduction to robotics for young children. Learn to build and program simple robots.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: '2',
      title: 'Coding Adventures',
      description: 'Fun coding adventures for children. Learn programming concepts through interactive games.',
      imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=500'
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Missing information",
        description: "Please provide a title and description",
        variant: "destructive"
      });
      return;
    }

    const course = {
      id: Date.now().toString(),
      title: newCourse.title,
      description: newCourse.description,
      imageUrl: newCourse.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500'
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', imageUrl: '' });
    
    toast({
      title: "Course added",
      description: `${course.title} has been added successfully`
    });
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(course => 
      course.id === editingCourse.id ? editingCourse : course
    );

    setCourses(updatedCourses);
    setEditingCourse(null);
    
    toast({
      title: "Course updated",
      description: `${editingCourse.title} has been updated successfully`
    });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    
    toast({
      title: "Course deleted",
      description: "The course has been deleted successfully"
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">Courses Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <Input
              id="title"
              value={editingCourse ? editingCourse.title : newCourse.title}
              onChange={(e) => editingCourse 
                ? setEditingCourse({...editingCourse, title: e.target.value})
                : setNewCourse({...newCourse, title: e.target.value})
              }
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Course Description
            </label>
            <Textarea
              id="description"
              value={editingCourse ? editingCourse.description : newCourse.description}
              onChange={(e) => editingCourse
                ? setEditingCourse({...editingCourse, description: e.target.value})
                : setNewCourse({...newCourse, description: e.target.value})
              }
              placeholder="Enter course description"
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <Input
              id="imageUrl"
              value={editingCourse ? editingCourse.imageUrl : newCourse.imageUrl}
              onChange={(e) => editingCourse
                ? setEditingCourse({...editingCourse, imageUrl: e.target.value})
                : setNewCourse({...newCourse, imageUrl: e.target.value})
              }
              placeholder="Enter image URL (optional)"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {editingCourse && (
              <Button 
                variant="ghost" 
                onClick={() => setEditingCourse(null)}
              >
                Cancel
              </Button>
            )}
            
            <Button
              onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
              className="bg-spaceteens-orange hover:bg-orange-600"
            >
              {editingCourse ? 'Update Course' : 'Add Course'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2">{course.title}</h4>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">{course.description}</p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingCourse(course)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
