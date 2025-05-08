
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Clipboard, ClipboardPlus, ClipboardX } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  id?: string;
  lesson_id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizBuilderProps {
  initialQuiz?: QuizData;
  onSave: (quizData: QuizData) => void;
  lessonTitle?: string;
}

const QuizBuilder = ({ initialQuiz, onSave, lessonTitle }: QuizBuilderProps) => {
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<QuizData>(
    initialQuiz || {
      lesson_id: '',
      title: '',
      description: '',
      questions: []
    }
  );
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  const handleQuizChange = (field: keyof QuizData, value: string) => {
    setQuiz({ ...quiz, [field]: value });
  };
  
  const handleQuestionChange = (value: string) => {
    setCurrentQuestion({ ...currentQuestion, question: value });
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options || []];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };
  
  const handleCorrectAnswerChange = (index: number) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: index });
  };

  const handleExplanationChange = (value: string) => {
    setCurrentQuestion({ ...currentQuestion, explanation: value });
  };
  
  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options?.some(opt => !opt)) {
      toast({
        title: "Incomplete question",
        description: "Please fill in the question and all options",
        variant: "destructive"
      });
      return;
    }
    
    const newQuestion = {
      id: Math.random().toString(36).substring(2, 9),
      question: currentQuestion.question || '',
      options: currentQuestion.options || ['', '', '', ''],
      correctAnswer: currentQuestion.correctAnswer || 0,
      explanation: currentQuestion.explanation || ''
    };
    
    if (editingQuestionIndex !== null) {
      const newQuestions = [...quiz.questions];
      newQuestions[editingQuestionIndex] = newQuestion;
      setQuiz({ ...quiz, questions: newQuestions });
      setEditingQuestionIndex(null);
    } else {
      setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    }
    
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    
    toast({
      title: editingQuestionIndex !== null ? "Question updated" : "Question added",
      description: editingQuestionIndex !== null ? "Your question has been updated" : "Your question has been added to the quiz"
    });
  };
  
  const editQuestion = (index: number) => {
    const question = quiz.questions[index];
    setCurrentQuestion(question);
    setEditingQuestionIndex(index);
  };
  
  const removeQuestion = (index: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: newQuestions });
    
    toast({
      title: "Question removed",
      description: "The question has been removed from the quiz"
    });
  };
  
  const handleSaveQuiz = () => {
    if (!quiz.title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the quiz",
        variant: "destructive"
      });
      return;
    }
    
    if (quiz.questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question to the quiz",
        variant: "destructive"
      });
      return;
    }
    
    onSave(quiz);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {lessonTitle && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-medium">Creating quiz for lesson: <span className="text-spaceteens-blue">{lessonTitle}</span></p>
          </div>
        )}
        
        <div>
          <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title
          </Label>
          <Input
            id="title"
            value={quiz.title}
            onChange={(e) => handleQuizChange('title', e.target.value)}
            placeholder="Enter quiz title"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Description
          </Label>
          <Textarea
            id="description"
            value={quiz.description}
            onChange={(e) => handleQuizChange('description', e.target.value)}
            placeholder="Enter quiz description"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">{editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </Label>
            <Textarea
              value={currentQuestion.question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder="Enter your question"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">
              Options
            </Label>
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCorrectAnswerChange(index)}
                >
                  {currentQuestion.correctAnswer === index ? 'Correct' : 'Mark Correct'}
                </Button>
              </div>
            ))}
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Answer Explanation (shown after answering)
            </Label>
            <Textarea
              value={currentQuestion.explanation}
              onChange={(e) => handleExplanationChange(e.target.value)}
              placeholder="Explain why the correct answer is right and/or why other options are wrong"
              className="h-24"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={addQuestion}
              className="bg-spaceteens-blue hover:bg-blue-700"
            >
              {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {quiz.questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quiz Questions</h3>
          
          {quiz.questions.map((q, index) => (
            <Card key={q.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => editQuestion(index)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeQuestion(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <p className="mb-2">{q.question}</p>
                <div className="space-y-1 ml-4 mb-3">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2 items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          q.correctAnswer === optIndex ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <h5 className="text-sm font-medium text-gray-700">Explanation:</h5>
                    <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveQuiz}
              className="bg-spaceteens-orange hover:bg-orange-600"
            >
              Save Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizBuilder;
