import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2, Plus, BookOpen, Sparkles, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import QuizBuilder from './QuizBuilder';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LessonsList from './LessonsList';

interface Lesson {
  id: string;
  title: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  created_at?: string;
}

const AdminQuizzes = () => {
  const { toast } = useToast();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

  // Fetch quizzes and lessons
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch lessons with better error handling
        console.log('Fetching lessons from Supabase...');
        
        // Check if the lessons table exists first
        const { data: tablesData, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          .eq('tablename', 'lessons');
          
        if (tablesError) {
          console.error('Error checking if lessons table exists:', tablesError);
        }
        
        console.log('Tables check result:', tablesData);
        
        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, title, course_id')
          .order('title');
          
        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
          throw lessonsError;
        }
        
        console.log('Lessons fetched:', lessonsData);
        setLessons(lessonsData || []);
        
        if (lessonsData && lessonsData.length > 0 && !selectedLesson) {
          setSelectedLesson(lessonsData[0].id);
        }
        
        // Fetch quizzes
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (quizzesError) throw quizzesError;
        
        // Parse the questions JSON
        const parsedQuizzes = quizzesData?.map(quiz => ({
          ...quiz,
          questions: typeof quiz.questions === 'string' 
            ? JSON.parse(quiz.questions as string) 
            : quiz.questions
        })) as Quiz[];
        
        setQuizzes(parsedQuizzes || []);
        
      } catch (error: any) {
        console.error('Error fetching data:', error);
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
  }, [toast, selectedLesson]);

  const handleCreateQuiz = () => {
    if (!selectedLesson) {
      toast({
        title: "Select a lesson",
        description: "Please select a lesson for this quiz",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentQuiz({
      id: '',
      lesson_id: selectedLesson,
      title: '',
      description: '',
      questions: []
    });
    
    setIsQuizDialogOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setCurrentQuiz({
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        explanation: q.explanation || ''
      }))
    });
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      
      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error deleting quiz",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveQuiz = async (quizData: Quiz) => {
    try {
      // Stringify the questions array for storage
      const questionsString = JSON.stringify(quizData.questions);
      
      if (quizData.id) {
        // Update existing quiz
        const { error } = await supabase
          .from('quizzes')
          .update({
            lesson_id: quizData.lesson_id,
            title: quizData.title,
            description: quizData.description,
            questions: questionsString
          })
          .eq('id', quizData.id);
          
        if (error) throw error;
        
        // Update local state
        setQuizzes(quizzes.map(quiz => 
          quiz.id === quizData.id ? {
            ...quizData,
            questions: quizData.questions
          } : quiz
        ));
        
        toast({
          title: "Quiz updated",
          description: "Your quiz has been updated successfully"
        });
      } else {
        // Create new quiz
        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            lesson_id: quizData.lesson_id,
            title: quizData.title,
            description: quizData.description,
            questions: questionsString
          })
          .select();
          
        if (error) throw error;
        
        // Add to local state
        if (data && data.length > 0) {
          const newQuiz = {
            ...data[0],
            questions: quizData.questions
          } as Quiz;
          
          setQuizzes([newQuiz, ...quizzes]);
          
          toast({
            title: "Quiz created",
            description: "Your quiz has been created successfully"
          });
        }
      }
      
      setIsQuizDialogOpen(false);
      setCurrentQuiz(null);
      
    } catch (error: any) {
      toast({
        title: "Error saving quiz",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getLessonTitle = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };

  const createSampleData = async () => {
    try {
      // Create a sample course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: 'Sample Course',
          description: 'This is a sample course for testing'
        })
        .select();
        
      if (courseError) throw courseError;
      
      if (courseData && courseData.length > 0) {
        // Create a sample lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            title: 'Sample Lesson',
            description: 'This is a sample lesson for testing',
            course_id: courseData[0].id,
            duration: '30 min'
          })
          .select();
          
        if (lessonError) throw lessonError;
        
        toast({
          title: 'Sample data created',
          description: 'Sample course and lesson have been created successfully'
        });
        
        // Refresh the data
        const { data: newLessons } = await supabase
          .from('lessons')
          .select('id, title')
          .order('title');
          
        setLessons(newLessons || []);
        
        if (newLessons && newLessons.length > 0) {
          setSelectedLesson(newLessons[0].id);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error creating sample data',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-spaceteens-blue">Quizzes</h2>
        <div className="relative">
          <Sparkles className="absolute -top-4 -right-4 text-spaceteens-orange animate-pulse-slow h-6 w-6" />
        </div>
      </div>
      
      <Card className="p-6 border-2 border-spaceteens-lightblue/30 bg-gradient-to-r from-white to-spaceteens-lightpink/10 rounded-2xl">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Lesson
            </label>
            {isLoading ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded-xl"></div>
            ) : lessons.length > 0 ? (
              <Select 
                value={selectedLesson} 
                onValueChange={setSelectedLesson}
              >
                <SelectTrigger className="rounded-xl border-spaceteens-lightblue/30">
                  <SelectValue placeholder="Choose a lesson for the new quiz" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-xl">
                <BookOpen className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-800">No lessons available</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateQuiz}
              disabled={!selectedLesson || lessons.length === 0}
              className="bg-spaceteens-teal hover:bg-spaceteens-teal/90 rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Button>
            
            {lessons.length === 0 && (
              <Button 
                onClick={createSampleData}
                variant="outline"
                className="border-spaceteens-orange text-spaceteens-orange hover:bg-spaceteens-orange hover:text-white rounded-xl"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create Sample Data
              </Button>
            )}
          </div>
        </div>
        
        {lessons.length === 0 && !isLoading && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
            <p>No lessons found. Please create lessons in the Lessons Management section or use the "Create Sample Data" button.</p>
          </div>
        )}
      </Card>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spaceteens-teal mr-2"></div>
                    Loading quizzes...
                  </div>
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText className="h-12 w-12 mb-2 text-spaceteens-lightblue/50" />
                    <p>No quizzes found. Create your first quiz using the button above.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map(quiz => (
                <TableRow key={quiz.id} className="hover:bg-spaceteens-lightpink/5">
                  <TableCell>
                    <div>
                      <div className="font-medium">{quiz.title}</div>
                      {quiz.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{quiz.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-spaceteens-lightblue" />
                      <span>{getLessonTitle(quiz.lesson_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-spaceteens-teal/10 text-spaceteens-teal px-2 py-1 rounded-full text-xs font-medium">
                      {quiz.questions.length} questions
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz)} 
                        className="border-spaceteens-lightblue text-spaceteens-lightblue hover:bg-spaceteens-lightblue hover:text-white rounded-lg">
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}
                        className="rounded-lg">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-spaceteens-blue mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-spaceteens-lightblue" />
          All Lessons
        </h2>
        <LessonsList />
      </div>
      
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-spaceteens-teal/30 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-spaceteens-blue flex items-center">
              {currentQuiz?.id ? (
                <>
                  <Pencil className="h-5 w-5 mr-2 text-spaceteens-orange" /> 
                  Edit Quiz
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2 text-spaceteens-teal" /> 
                  Create New Quiz
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {currentQuiz && (
            <QuizBuilder
              initialQuiz={currentQuiz}
              onSave={handleSaveQuiz}
              lessonTitle={getLessonTitle(currentQuiz.lesson_id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizzes;
