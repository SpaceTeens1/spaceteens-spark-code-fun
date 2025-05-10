
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
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
        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, title')
          .order('title');
          
        if (lessonsError) throw lessonsError;
        
        console.log('Lessons fetched:', lessonsData);
        setLessons(lessonsData || []);
        
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
  }, [toast]);

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spaceteens-blue">Quizzes</h2>
      </div>
      
      <Card className="p-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Lesson
            </label>
            <Select 
              value={selectedLesson} 
              onValueChange={setSelectedLesson}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a lesson for the new quiz" />
              </SelectTrigger>
              <SelectContent>
                {lessons && lessons.length > 0 ? (
                  lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No lessons available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleCreateQuiz}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Quiz
          </Button>
        </div>
      </Card>
      
      <div>
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
                <TableCell colSpan={4} className="text-center py-4">Loading quizzes...</TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">No quizzes found. Create your first quiz using the button above.</TableCell>
              </TableRow>
            ) : (
              quizzes.map(quiz => (
                <TableRow key={quiz.id}>
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
                      <BookOpen className="h-4 w-4 text-spaceteens-blue" />
                      <span>{getLessonTitle(quiz.lesson_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{quiz.questions.length} questions</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
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
        <h2 className="text-2xl font-bold text-spaceteens-blue mb-4">All Lessons</h2>
        <LessonsList />
      </div>
      
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.id ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
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
