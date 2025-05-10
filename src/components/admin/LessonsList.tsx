import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BookOpen } from 'lucide-react';
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
  const {
    toast
  } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching lessons and courses from Supabase...');

        // Fetch all lessons
        const {
          data: lessonsData,
          error: lessonsError
        } = await supabase.from('lessons').select('*').order('title');
        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
          throw lessonsError;
        }
        console.log('Raw lessons data:', lessonsData);

        // Fetch all courses for displaying course names
        const {
          data: coursesData,
          error: coursesError
        } = await supabase.from('courses').select('id, title').order('title');
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
  const createSampleData = async () => {
    try {
      // Create a sample course
      const {
        data: courseData,
        error: courseError
      } = await supabase.from('courses').insert({
        title: 'Sample Course',
        description: 'This is a sample course for testing'
      }).select();
      if (courseError) throw courseError;
      if (courseData && courseData.length > 0) {
        // Create a sample lesson
        const {
          data: lessonData,
          error: lessonError
        } = await supabase.from('lessons').insert({
          title: 'Sample Lesson',
          description: 'This is a sample lesson for testing',
          course_id: courseData[0].id,
          duration: '30 min'
        }).select();
        if (lessonError) throw lessonError;
        toast({
          title: 'Sample data created',
          description: 'Sample course and lesson have been created successfully'
        });

        // Refresh the data
        const {
          data: newLessons
        } = await supabase.from('lessons').select('*').order('title');
        const {
          data: newCourses
        } = await supabase.from('courses').select('id, title').order('title');
        setLessons(newLessons || []);
        setCourses(newCourses || []);
      }
    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast({
        title: 'Error creating sample data',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  return <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Lessons</CardTitle>
        {lessons.length === 0 && !isLoading}
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
            {isLoading ? <TableRow>
                <TableCell colSpan={4} className="text-center py-4">Loading lessons...</TableCell>
              </TableRow> : lessons.length === 0 ? <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No lessons found. Use the button above to create sample data or add lessons in the Lessons Management section.
                </TableCell>
              </TableRow> : lessons.map(lesson => <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-spaceteens-blue" />
                      <span>{getCourseTitle(lesson.course_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{lesson.description}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
};
export default LessonsList;