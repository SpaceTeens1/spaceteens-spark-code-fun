
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import FileUploader from '@/components/admin/FileUploader';
import QuizBuilder from '@/components/admin/QuizBuilder';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Video, File } from 'lucide-react';

// Mock course type
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface Attachment {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'other';
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentTab, setCurrentTab] = useState('details');
  
  // Mock data for attachments and quizzes
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  // Load attachments and quizzes for selected course
  useEffect(() => {
    if (selectedCourse) {
      // In a real app, you would fetch these from your database
      // For now, we'll just use mock data
      setAttachments([
        {
          id: '1',
          title: 'Robotics Basics PDF',
          url: 'https://example.com/robotics-basics.pdf',
          type: 'pdf'
        },
        {
          id: '2',
          title: 'Introduction to Robots',
          url: 'https://www.youtube.com/watch?v=example',
          type: 'video'
        }
      ]);
      
      setQuizzes([
        {
          id: '1',
          title: 'Robotics Fundamentals Quiz',
          description: 'Test your knowledge of basic robotics concepts',
          questions: [
            {
              id: 'q1',
              question: 'What is a robot?',
              options: [
                'A machine that can think like humans',
                'A programmable machine that can carry out actions',
                'A computer with arms and legs',
                'A toy that moves on its own'
              ],
              correctAnswer: 1
            }
          ]
        }
      ]);
    }
  }, [selectedCourse]);

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
  
  const handleFileUploaded = (url: string, fileName: string) => {
    // Determine file type
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    let type: 'pdf' | 'video' | 'other' = 'other';
    
    if (fileExt === 'pdf') {
      type = 'pdf';
    } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExt || '')) {
      type = 'video';
    }
    
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      title: fileName,
      url: url,
      type: type
    };
    
    setAttachments([...attachments, newAttachment]);
  };
  
  const handleDeleteAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    
    toast({
      title: "Attachment deleted",
      description: "The attachment has been deleted successfully"
    });
  };
  
  const handleSaveQuiz = (quizData: any) => {
    if (quizData.id) {
      setQuizzes(quizzes.map(q => q.id === quizData.id ? quizData : q));
    } else {
      const newQuiz = {
        ...quizData,
        id: Date.now().toString()
      };
      setQuizzes([...quizzes, newQuiz]);
    }
  };
  
  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    
    toast({
      title: "Quiz deleted",
      description: "The quiz has been deleted successfully"
    });
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
        <h2 className="text-2xl font-bold text-spaceteens-blue">Courses Management</h2>
      </div>

      {selectedCourse ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCourse(null)}
            >
              Back to Courses
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="aspect-video overflow-hidden rounded-md">
                      <img 
                        src={selectedCourse.imageUrl} 
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold">{selectedCourse.title}</h3>
                    <p className="text-gray-600">{selectedCourse.description}</p>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingCourse(selectedCourse);
                          setSelectedCourse(null);
                        }}
                      >
                        Edit Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attachments">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Upload New Attachment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            File
                          </label>
                          <FileUploader
                            bucketName="course-materials"
                            folderPath={`courses/${selectedCourse.id}`}
                            onFileUploaded={handleFileUploaded}
                            acceptedFileTypes=".pdf,.mp4,.mov,.avi,.webm,.doc,.docx,.ppt,.pptx"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-4">Course Attachments</h3>
                      
                      {attachments.length === 0 ? (
                        <p className="text-gray-500">No attachments for this course yet</p>
                      ) : (
                        <div className="space-y-2">
                          {attachments.map((attachment) => (
                            <Card key={attachment.id}>
                              <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  {getTypeIcon(attachment.type)}
                                  <div>
                                    <h4 className="font-medium">{attachment.title}</h4>
                                    <a 
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer" 
                                      className="text-blue-500 hover:underline text-sm"
                                    >
                                      View file
                                    </a>
                                  </div>
                                </div>
                                
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteAttachment(attachment.id)}
                                >
                                  Delete
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quizzes">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Create New Quiz</h3>
                      <QuizBuilder onSave={handleSaveQuiz} />
                    </div>
                    
                    {quizzes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-4">Course Quizzes</h3>
                        
                        <div className="space-y-4">
                          {quizzes.map((quiz) => (
                            <Card key={quiz.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-bold">{quiz.title}</h4>
                                    <p className="text-gray-600">{quiz.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {quiz.questions.length} questions
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                        setCurrentTab('quizzes');
                                        // In a real app, you would load the quiz for editing
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeleteQuiz(quiz.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
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
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden cursor-pointer" onClick={() => setSelectedCourse(course)}>
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
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Manage
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
        </>
      )}
    </div>
  );
};

export default AdminCourses;
