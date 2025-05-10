
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
        // Fetch all lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .order('title');
          
        if (lessonsError) throw lessonsError;
        
        // Fetch all courses for displaying course names
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title')
          .order('title');
          
        if (coursesError) throw coursesError;
        
        setLessons(lessonsData || []);
        setCourses(coursesData || []);
      } catch (error: any) {
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
    <Card>
      <CardHeader>
        <CardTitle>All Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
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
                <TableCell colSpan={4} className="text-center py-4">Loading lessons...</TableCell>
              </TableRow>
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">No lessons found.</TableCell>
              </TableRow>
            ) : (
              lessons.map(lesson => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-spaceteens-blue" />
                      <span>{getCourseTitle(lesson.course_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{lesson.description}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
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
