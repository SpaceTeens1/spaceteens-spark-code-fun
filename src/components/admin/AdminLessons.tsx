
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
}

const AdminLessons = () => {
  const { toast } = useToast();
  
  // Mock courses for dropdown
  const courses = [
    { id: '1', title: 'Robotics for Kids' },
    { id: '2', title: 'Coding Adventures' },
  ];
  
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      courseId: '1',
      title: 'Introduction to Robots',
      description: 'Learn the basics of what robots are and how they work.',
      duration: '45 min'
    },
    {
      id: '2',
      courseId: '1',
      title: 'Building Your First Robot',
      description: 'Start building a simple robot using LEGO components.',
      duration: '60 min'
    },
    {
      id: '3',
      courseId: '2',
      title: 'Coding Fundamentals',
      description: 'Learn the basics of coding concepts.',
      duration: '45 min'
    }
  ]);
  
  const [newLesson, setNewLesson] = useState({
    courseId: '',
    title: '',
    description: '',
    duration: ''
  });
  
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  
  const handleAddLesson = () => {
    if (!newLesson.courseId || !newLesson.title) {
      toast({
        title: "Missing information",
        description: "Please select a course and provide a title",
        variant: "destructive"
      });
      return;
    }
    
    const lesson = {
      id: Date.now().toString(),
      courseId: newLesson.courseId,
      title: newLesson.title,
      description: newLesson.description,
      duration: newLesson.duration
    };
    
    setLessons([...lessons, lesson]);
    setNewLesson({
      courseId: '',
      title: '',
      description: '',
      duration: ''
    });
    
    toast({
      title: "Lesson added",
      description: `${lesson.title} has been added successfully`
    });
  };
  
  const handleUpdateLesson = () => {
    if (!editingLesson) return;
    
    const updatedLessons = lessons.map(lesson => 
      lesson.id === editingLesson.id ? editingLesson : lesson
    );
    
    setLessons(updatedLessons);
    setEditingLesson(null);
    
    toast({
      title: "Lesson updated",
      description: `${editingLesson.title} has been updated successfully`
    });
  };
  
  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    
    toast({
      title: "Lesson deleted",
      description: "The lesson has been deleted successfully"
    });
  };
  
  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">Lessons Management</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="courseId"
              value={editingLesson ? editingLesson.courseId : newLesson.courseId}
              onChange={(e) => editingLesson 
                ? setEditingLesson({...editingLesson, courseId: e.target.value})
                : setNewLesson({...newLesson, courseId: e.target.value})
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title
            </label>
            <Input
              id="title"
              value={editingLesson ? editingLesson.title : newLesson.title}
              onChange={(e) => editingLesson 
                ? setEditingLesson({...editingLesson, title: e.target.value})
                : setNewLesson({...newLesson, title: e.target.value})
              }
              placeholder="Enter lesson title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Description
            </label>
            <Textarea
              id="description"
              value={editingLesson ? editingLesson.description : newLesson.description}
              onChange={(e) => editingLesson
                ? setEditingLesson({...editingLesson, description: e.target.value})
                : setNewLesson({...newLesson, description: e.target.value})
              }
              placeholder="Enter lesson description"
            />
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <Input
              id="duration"
              value={editingLesson ? editingLesson.duration : newLesson.duration}
              onChange={(e) => editingLesson
                ? setEditingLesson({...editingLesson, duration: e.target.value})
                : setNewLesson({...newLesson, duration: e.target.value})
              }
              placeholder="e.g. 45 min"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {editingLesson && (
              <Button 
                variant="ghost" 
                onClick={() => setEditingLesson(null)}
              >
                Cancel
              </Button>
            )}
            
            <Button
              onClick={editingLesson ? handleUpdateLesson : handleAddLesson}
              className="bg-spaceteens-teal hover:bg-teal-600"
            >
              {editingLesson ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Lesson Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map(lesson => (
              <TableRow key={lesson.id}>
                <TableCell>{getCourseTitle(lesson.courseId)}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell className="max-w-xs truncate">{lesson.description}</TableCell>
                <TableCell>{lesson.duration}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingLesson(lesson)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
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

export default AdminLessons;
