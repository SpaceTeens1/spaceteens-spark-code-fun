
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BookOpen, Clock, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
}

const LessonsList = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching lessons and courses from Supabase...');

        // Fetch all lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .order('title');
          
        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
          throw lessonsError;
        }
        
        console.log('Raw lessons data:', lessonsData);

        // Fetch all courses for displaying course names
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title')
          .order('title');
          
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          throw coursesError;
        }
        
        console.log('Raw courses data:', coursesData);
        setLessons(lessonsData || []);
        setCourses(coursesData || []);
      } catch (error: any) {
        console.error('Error in LessonsList:', error);
        toast({
          title: 'Error fetching lessons',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <Card className="border-2 border-spaceteens-blue/10 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-spaceteens-blue/5 to-transparent">
        <CardTitle className="text-spaceteens-blue flex items-center">
          <FileText className="mr-2 h-5 w-5 text-spaceteens-blue" />
          All Lessons
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-spaceteens-lightblue/5">
            <TableRow>
              <TableHead>Lesson Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spaceteens-teal mr-2"></div>
                    Loading lessons...
                  </div>
                </TableCell>
              </TableRow>
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <BookOpen className="h-12 w-12 mb-2 text-spaceteens-lightblue/50" />
                    <p>No lessons found. Add lessons in the Lessons Management section.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lessons.map(lesson => (
                <TableRow key={lesson.id} className="hover:bg-spaceteens-lightpink/5">
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-spaceteens-orange" />
                      <span className="bg-spaceteens-orange/10 text-spaceteens-orange px-2 py-1 rounded-full text-xs font-medium">
                        {getCourseTitle(lesson.course_id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600">{lesson.description}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-spaceteens-teal" />
                      <span>{lesson.duration}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LessonsList;
